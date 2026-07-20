// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactRatelimit } from '@/lib/rate-limit';
import { contactSchema } from '@/validations/contact-validation';
import {
  sendContactAcknowledgementEmail,
  sendContactNotificationEmail,
} from '@/lib/mail/contact-emails';
import logger from '@/utils/logger';
import {
  handleApiError,
  ForbiddenError,
  TooManyRequestsError,
  ValidationError,
} from '@/middlewares/error-handler';

/**
 * POST /api/contact
 * Public - emails a website enquiry to the team and confirms receipt to the
 * sender. Messages are not stored; the inbox is the record.
 *
 * Guarded by a honeypot field and a per-IP rate limit.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    const { success } = await contactRatelimit.limit(ip);

    if (!success) {
      throw new TooManyRequestsError(
        'You have sent several messages already. Please try again in a few minutes.',
      );
    }

    const body = await req.json();

    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError('Validation failed', {
        code: 'VALIDATION_ERROR',
        context: validation.error.flatten() as unknown as Record<
          string,
          unknown
        >,
      });
    }

    const { website, ...message } = validation.data;

    // Only a bot fills a field it cannot see. Rejected without a hint as to why.
    if (website) {
      throw new ForbiddenError('Request rejected.', { code: 'BOT_DETECTED' });
    }

    // Awaited: the visitor is only told "sent" once it really is.
    await sendContactNotificationEmail(message);

    // Best-effort receipt - never let it fail the request.
    await sendContactAcknowledgementEmail(message);

    logger.info({ subject: message.subject }, 'Contact message delivered');

    return NextResponse.json({
      message:
        'Thanks for reaching out - your message is on its way and we will be in touch shortly.',
    });
  } catch (err) {
    return handleApiError(err);
  }
}
