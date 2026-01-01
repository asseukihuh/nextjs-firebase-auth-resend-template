import { getAppBaseUrl } from './app-config';

const buildUrl = (path: string, params: Record<string, string>): string => {
  const base = getAppBaseUrl();
  const url = new URL(path, base.endsWith('/') ? base : `${base}/`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};

export const buildVerificationLink = (token: string, uid: string): string => {
  return buildUrl('/auth/verify-email', { token, uid });
};

export const buildEmailChangeLink = (token: string, uid: string): string => {
  return buildUrl('/auth/confirm-email-change', { token, uid });
};
