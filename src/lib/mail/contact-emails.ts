// src/lib/mail/contact-emails.ts
import 'server-only';
import { ENV } from '@/config/env';
import logger from '@/utils/logger';
import { getTransporter } from './transporter';
import { escapeHtml, escapeHtmlWithBreaks } from '@/utils/escape-html';

export interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const BRAND_BLUE = '#2563eb';

/** The one shared shell every contact email renders inside. */
const wrap = (heading: string, body: string): string => `
  <div style="max-width: 560px; margin: 0 auto; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <div style="background-color: ${BRAND_BLUE}; padding: 20px 24px; border-radius: 8px 8px 0 0;">
      <span style="color: #ffffff; font-size: 18px; font-weight: bold;">${escapeHtml(ENV.EMAIL_FROM_NAME)}</span>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
      <h2 style="margin: 0 0 16px 0; font-size: 20px;">${heading}</h2>
      ${body}
    </div>
    <p style="margin: 16px 0 0 0; text-align: center; color: #9ca3af; font-size: 12px;">
      Chosen Fintech Solutions &middot; Tamale, Ghana
    </p>
  </div>`;

const paragraph = (content: string): string =>
  `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #404040;">${content}</p>`;

const quoteBlock = (content: string): string =>
  `<div style="margin: 16px 0; padding: 14px 16px; background: #f8fafc; border-left: 3px solid ${BRAND_BLUE}; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #404040;">${content}</div>`;

/** Where staff notifications land - the shared inbox unless overridden. */
const adminRecipient = (): string =>
  ENV.CONTACT_RECIPIENT_EMAIL ?? ENV.ADMIN_EMAIL;

/**
 * Emails the enquiry to the team. Awaited by the route so a visitor is never
 * told their message was sent when it never left the building.
 */
export const sendContactNotificationEmail = async (
  input: IContactMessage,
): Promise<void> => {
  const body =
    paragraph(
      `New message from the website contact form about <strong>${escapeHtml(input.subject)}</strong>.`,
    ) +
    paragraph(`<strong>From:</strong> ${escapeHtml(input.name)}`) +
    paragraph(
      `<strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}" style="color: ${BRAND_BLUE};">${escapeHtml(input.email)}</a>`,
    ) +
    (input.phone
      ? paragraph(`<strong>Phone:</strong> ${escapeHtml(input.phone)}`)
      : '') +
    paragraph('<strong>Message:</strong>') +
    quoteBlock(escapeHtmlWithBreaks(input.message));

  await getTransporter().sendMail({
    from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.GMAIL_USER}>`,
    to: adminRecipient(),
    // Replying from the inbox goes straight back to the visitor.
    replyTo: `"${input.name}" <${input.email}>`,
    subject: `Contact: ${input.subject} from ${input.name}`,
    html: wrap('New contact message', body),
  });
};

/**
 * Confirms receipt to the visitor. Fire-and-forget: the team already has the
 * message, so a failed receipt is logged rather than failing the request.
 */
export const sendContactAcknowledgementEmail = async (
  input: IContactMessage,
): Promise<void> => {
  const firstName = input.name.split(/\s+/)[0] || 'there';

  const body =
    paragraph(`Hi ${escapeHtml(firstName)},`) +
    paragraph(
      `Thanks for reaching out to ${escapeHtml(ENV.EMAIL_FROM_NAME)}. We have received your message about <strong>${escapeHtml(input.subject)}</strong> and a member of our team will get back to you shortly.`,
    ) +
    paragraph('Here is a copy of what you sent us:') +
    quoteBlock(escapeHtmlWithBreaks(input.message)) +
    paragraph(
      'If this was not you, you can safely ignore this email and nothing further will happen.',
    );

  try {
    await getTransporter().sendMail({
      from: `"${ENV.EMAIL_FROM_NAME}" <${ENV.GMAIL_USER}>`,
      to: input.email,
      replyTo: adminRecipient(),
      subject: `We have received your message - ${ENV.EMAIL_FROM_NAME}`,
      html: wrap('We have received your message', body),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to send contact acknowledgement email');
  }
};
