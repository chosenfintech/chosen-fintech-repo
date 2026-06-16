// src/lib/mail/auth-emails.ts
import 'server-only';
import { ENV } from '@/config/env';
import logger from '@/utils/logger';
import { getTransporter } from './transporter';
import {
  TWO_FACTOR_CODE_TTL_MINUTES,
  PASSWORD_RESET_TTL_MINUTES,
} from '@/utils/user-security-tokens';

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

/**
 * Emails a password-reset link. Fire-and-forget: failures are logged and
 * swallowed so the forgot-password endpoint stays generic and non-blocking.
 */
export const sendPasswordResetEmail = async (
  user: { id: string; fullname: string; email: string },
  resetUrl: string,
): Promise<void> => {
  const html = `
    <div style="max-width: 560px; margin: 0 auto; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
      <h2 style="margin: 0 0 16px 0;">Reset Your Password</h2>
      <p style="margin: 0 0 16px 0;">Hi ${user.fullname},</p>
      <p style="margin: 0 0 16px 0;">We received a request to reset the password for your admin account.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-weight: bold; text-decoration: none;">Reset Password</a>
      </div>
      <p style="margin: 0 0 16px 0;">This link expires in ${PASSWORD_RESET_TTL_MINUTES} minutes and can be used once.</p>
      <p style="margin: 0 0 8px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="margin: 0 0 16px 0; word-break: break-all; font-size: 13px; color: #555;">${resetUrl}</p>
      <p style="margin: 0; color: #6b7280; font-size: 13px;">If you did not request a password reset, you can safely ignore this email — your password will not change.</p>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.GMAIL_USER}>`,
      to: user.email,
      subject: `Reset your password — ${ENV.EMAIL_FROM_NAME}`,
      html,
    });
  } catch (error) {
    logger.error({ error, userId: user.id }, 'Failed to send password reset email');
  }
};

/** Notifies a user that their password was just changed. Fire-and-forget. */
export const sendPasswordChangedEmail = async (user: {
  id: string;
  fullname: string;
  email: string;
}): Promise<void> => {
  const html = `
    <div style="max-width: 560px; margin: 0 auto; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
      <h2 style="margin: 0 0 16px 0;">Password Changed</h2>
      <p style="margin: 0 0 16px 0;">Hi ${user.fullname},</p>
      <p style="margin: 0 0 16px 0;">This is a confirmation that the password for your admin account was just changed.</p>
      <p style="margin: 0 0 16px 0;">If this was you, no further action is needed.</p>
      <p style="margin: 0; color: #6b7280; font-size: 13px;">If you did <strong>not</strong> make this change, contact an administrator immediately.</p>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.GMAIL_USER}>`,
      to: user.email,
      subject: `Your password was changed — ${ENV.EMAIL_FROM_NAME}`,
      html,
    });
  } catch (error) {
    logger.error({ error, userId: user.id }, 'Failed to send password changed email');
  }
};
