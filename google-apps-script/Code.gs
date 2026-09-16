const SESSION_TTL_SECONDS = 21600; // 6 hours
const SERVICE_NAME = 'Nakama Premium CMS API';
const API_VERSION = '1.0.0';

function doGet() {
  return jsonResponse({
    ok: true,
    service: SERVICE_NAME,
    version: API_VERSION,
    status: 'online',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Request data tidak ditemukan.');
    }

    const data = JSON.parse(e.postData.contents);
    const action = String(data.action || '').trim();

    if (action === 'login') {
      return jsonResponse(login(data.password));
    }

    if (action === 'logout') {
      return jsonResponse(logout(data.token));
    }

    if (action === 'health') {
      return jsonResponse(health());
    }

    if (action === 'publish') {
      requireSession(data.token);
      return jsonResponse(publishAtomically(data.files, data.message));
    }

    throw new Error('Action tidak dikenal.');
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function health() {
  return {
    ok: true,
    service: SERVICE_NAME,
    version: API_VERSION,
    status: 'online',
    githubConfigured: Boolean(
      PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN') &&
      PropertiesService.getScriptProperties().getProperty('GITHUB_OWNER') &&
      PropertiesService.getScriptProperties().getProperty('GITHUB_REPO')
    )
  };
}

function login(password) {
  const supplied = String(password || '');
  if (!supplied) throw new Error('Password wajib diisi.');

  const props = PropertiesService.getScriptProperties();
  const expectedHash = props.getProperty('CMS_PASSWORD_HASH');
  if (!expectedHash) {
    throw new Error('CMS_PASSWORD_HASH belum diset di Script Properties.');
  }

  const suppliedHash = sha256Hex(supplied);
  if (!constantTimeEqual(suppliedHash, expectedHash)) {
    throw new Error('Password salah.');
  }

  const token = Utilities.getUuid() + '-' + Utilities.getUuid();
  CacheService.getScriptCache().put('session:' + token, '1', SESSION_TTL_SECONDS);

  return {
    ok: true,
    token: token,
    expiresIn: SESSION_TTL_SECONDS
  };
}

function logout(token) {
  if (token) CacheService.getScriptCache().remove('session:' + String(token));
  return { ok: true };
}

function requireSession(token) {
  if (!token || CacheService.getScriptCache().get('session:' + String(token)) !== '1') {
    throw new Error('Sesi CMS tidak valid atau sudah berakhir. Silakan login kembali.');
  }
}

function sha256Hex(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(value),
    Utilities.Charset.UTF_8
  );

  return bytes.map(function (b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function constantTimeEqual(a, b) {
  a = String(a || '');
  b = String(b || '');
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function publishAtomically(files, message) {
  if (!files || typeof files !== 'object' || Array.isArray(files)) {
    throw new Error('Daftar file publish tidak valid.');
  }

  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_TOKEN');
  const owner = props.getProperty('GITHUB_OWNER');
  const repo = props.getProperty('GITHUB_REPO');
  const branch = props.getProperty('GITHUB_BRANCH') || 'main';

  if (!token || !owner || !repo) {
    throw new Error('Konfigurasi GitHub belum lengkap di Script Properties.');
  }

  const baseRef = githubApi(
    'GET',
    '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/ref/heads/' + encodeURIComponent(branch),
    token
  );

  const baseCommitSha = baseRef.object && baseRef.object.sha;
  if (!baseCommitSha) throw new Error('Commit branch GitHub tidak ditemukan.');

  const baseCommit = githubApi(
    'GET',
    '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/commits/' + baseCommitSha,
    token
  );

  const blobs = [];
  Object.keys(files).forEach(function (path) {
    const content = files[path];
    if (typeof content !== 'string') return;

    const blob = githubApi(
      'POST',
      '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/blobs',
      token,
      {
        content: Utilities.base64Encode(Utilities.newBlob(content).getBytes()),
        encoding: 'base64'
      }
    );

    blobs.push({
      path: normalizeRepoPath(path),
      mode: '100644',
      type: 'blob',
      sha: blob.sha
    });
  });

  if (!blobs.length) throw new Error('Tidak ada file untuk dipublish.');

  const tree = githubApi(
    'POST',
    '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/trees',
    token,
    {
      base_tree: baseCommit.tree.sha,
      tree: blobs
    }
  );

  const commit = githubApi(
    'POST',
    '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/commits',
    token,
    {
      message: String(message || ('Update ' + repo + ' content via Nakama Premium CMS')),
      tree: tree.sha,
      parents: [baseCommitSha]
    }
  );

  githubApi(
    'PATCH',
    '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + '/git/refs/heads/' + encodeURIComponent(branch),
    token,
    { sha: commit.sha, force: false }
  );

  return {
    ok: true,
    message: 'GitHub publish berhasil.',
    commitSha: commit.sha,
    branch: branch,
    files: blobs.map(function (b) { return b.path; }),
    repository: owner + '/' + repo
  };
}

function normalizeRepoPath(path) {
  return String(path || '')
    .replace(/^\/+/, '')
    .replace(/\\/g, '/')
    .trim();
}

function githubApi(method, path, token, body) {
  const url = 'https://api.github.com' + path;
  const options = {
    method: method,
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };

  if (body !== undefined) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(body);
  }

  const response = UrlFetchApp.fetch(url, options);
  const status = response.getResponseCode();
  const raw = response.getContentText();
  let data;

  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error('GitHub mengembalikan response tidak valid (HTTP ' + status + ').');
  }

  if (status < 200 || status >= 300) {
    throw new Error('GitHub error (' + status + '): ' + (data.message || raw));
  }

  return data;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Jalankan manual SEKALI di Apps Script editor setelah mengganti password.
 * Contoh: setCmsPassword('PasswordPelangganYangKuat');
 */
function setCmsPassword(password) {
  const value = String(password || '');
  if (value.length < 10) {
    throw new Error('Password minimal 10 karakter.');
  }
  PropertiesService.getScriptProperties().setProperty('CMS_PASSWORD_HASH', sha256Hex(value));
}
