// src/lib/mail/auth-emails.ts
import 'server-only';
import { ENV } from '@/config/env';
import logger from '@/utils/logger';
import { getTransporter } from './transporter';
import { TWO_FACTOR_CODE_TTL_MINUTES } from '@/utils/user-security-tokens';

const codeBlock = (code: string): string => `
  <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
    ${code}
  </div>`;

const buildHtml = (
  recipientName: string,
  title: string,
  purpose: 'login' | 'setup',
  code: string,
): string => `
  <div style="max-width: 560px; margin: 0 auto; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <h2 style="margin: 0 0 16px 0;">${title}</h2>
    <p style="margin: 0 0 16px 0;">Hi ${recipientName},</p>
    <p style="margin: 0 0 16px 0;">${
      purpose === 'login'
        ? 'Use the code below to finish signing in to the admin dashboard:'
        : 'Use the code below to confirm enabling two-factor authentication on your account:'
    }</p>
    ${codeBlock(code)}
    <p style="margin: 0 0 16px 0;">This code expires in ${TWO_FACTOR_CODE_TTL_MINUTES} minutes.</p>
    <p style="margin: 0; color: #6b7280; font-size: 13px;">If you did not request this, you can safely ignore this email${
      purpose === 'login'
        ? ' — but consider changing your password, since someone may know it'
        : ''
    }.</p>
  </div>`;

/**
 * Emails a two-factor authentication code. Fire-and-forget at the call site:
 * failures are logged and swallowed so a transient mail error never leaks
 * whether an account exists or blocks the request flow.
 */
export const sendTwoFactorCodeEmail = async (
  user: { id: string; fullname: string; email: string },
  code: string,
  purpose: 'login' | 'setup',
): Promise<void> => {
  const title =
    purpose === 'login' ? 'Your Login Code' : 'Confirm Two-Factor Setup';

  try {
    await getTransporter().sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.GMAIL_USER}>`,
      to: user.email,
      subject: `${title} — ${ENV.EMAIL_FROM_NAME}`,
      html: buildHtml(user.fullname, title, purpose, code),
    });
  } catch (error) {
    logger.error(
      { error, userId: user.id, purpose },
      'Failed to send two-factor code email',
    );
  }
};
