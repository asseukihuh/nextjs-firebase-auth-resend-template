import { getAppName } from './app-config';

const ctaStyle = 'display:inline-block;padding:10px 16px;border-radius:6px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600';
const textStyle = 'font-family:Inter,system-ui,-apple-system,sans-serif;color:#111827;line-height:1.5;font-size:14px;';

export const verificationEmail = (link: string) => {
  const appName = getAppName();
  return {
    subject: `Verify your email for ${appName}`,
    html: `
      <div style="${textStyle}">
        <h2 style="margin:0 0 12px 0;">Welcome to ${appName}</h2>
        <p style="margin:0 0 12px 0;">Thanks for signing up. Please confirm your email to activate your account.</p>
        <a href="${link}" style="${ctaStyle}" target="_blank" rel="noreferrer">Verify email</a>
        <p style="margin:16px 0 0 0;">If the button does not work, copy and paste this link:</p>
        <p style="margin:4px 0 0 0; word-break:break-all;">${link}</p>
        <p style="margin:16px 0 0 0; color:#6b7280;">This link expires in 24 hours.</p>
      </div>
    `,
  };
};

export const confirmEmailChangeEmail = (link: string, currentEmail: string, newEmail: string) => {
  const appName = getAppName();
  return {
    subject: `Confirm your email change - ${appName}`,
    html: `
      <div style="${textStyle}">
        <h2 style="margin:0 0 12px 0;">Confirm your new email</h2>
        <p style="margin:0 0 12px 0;">You requested to change your email from <strong>${currentEmail}</strong> to <strong>${newEmail}</strong>.</p>
        <a href="${link}" style="${ctaStyle}" target="_blank" rel="noreferrer">Confirm email change</a>
        <p style="margin:16px 0 0 0;">If the button does not work, copy and paste this link:</p>
        <p style="margin:4px 0 0 0; word-break:break-all;">${link}</p>
        <p style="margin:16px 0 0 0; color:#6b7280;">This link expires in 24 hours. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };
};
