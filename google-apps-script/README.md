# Nakama Premium CMS API

Backend Google Apps Script untuk `NAKAMA-PREMIUM-CMS`.

Fungsi:

- Customer password login
- Session token dengan masa berlaku terbatas
- Session validation dan logout
- Atomic GitHub publish menggunakan Git Data API
- GitHub token tetap berada di Script Properties, bukan di frontend

## Script Properties

Set nilai berikut di Apps Script → Project Settings → Script Properties:

```text
CMS_PASSWORD_HASH = <SHA-256 password customer>
GITHUB_TOKEN = <GitHub token dengan akses Contents read/write>
GITHUB_OWNER = barrack3030-wq
GITHUB_REPO = NAKAMA-PREMIUM-CMS
GITHUB_BRANCH = main
```

Untuk membuat hash password, jalankan fungsi berikut dari editor Apps Script setelah mengganti password:

```javascript
setCmsPassword('PasswordCustomerMinimal10Karakter');
```

Password asli tidak disimpan di repository.

## Web App deployment

Deploy sebagai Web App:

- Execute as: Me
- Who has access: Anyone
- Gunakan URL `/exec`

Setelah deployment, masukkan URL `/exec` ke `cms-config.json`:

```json
{
  "apiEndpoint": "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
}
```

Alternatif untuk build tertentu: gunakan `VITE_CMS_API_ENDPOINT`.

## API actions

```text
GET  /exec
POST /exec action=login
POST /exec action=validateSession
POST /exec action=logout
POST /exec action=publish
```

`publish` membutuhkan session token yang valid. Frontend hanya mengirim file content; GitHub token disimpan server-side di Apps Script.
