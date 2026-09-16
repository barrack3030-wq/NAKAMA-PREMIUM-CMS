import { cmsApi, getCmsApiEndpoint, getCmsSessionToken } from './api';
import type { CmsConfig } from './types';

export async function publishCmsFiles(
  config: CmsConfig,
  files: Record<string, string>,
  message?: string
) {
  const endpoint = getCmsApiEndpoint(config.apiEndpoint);
  const token = getCmsSessionToken();

  if (!token) throw new Error('Sesi CMS tidak ditemukan. Silakan login kembali.');

  return cmsApi(endpoint, 'publish', {
    token,
    files,
    message: message || `Update ${config.siteName} content via Nakama Premium CMS`
  });
}
