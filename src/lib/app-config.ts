export const getAppName = (): string => process.env.APP_NAME || 'Your App';

export const getAppBaseUrl = (): string => {
  return process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const getEmailFrom = (): string => process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export const getEmailReplyTo = (): string | undefined => process.env.RESEND_REPLY_TO;

export const getResendFromHeader = (): string => `${getAppName()} <${getEmailFrom()}>`;
