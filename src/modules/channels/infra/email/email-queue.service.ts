import { queueService, type QueueService } from "@/core/queue";
import {
  EMAIL_QUEUE_NAME,
  type EmailQueueMessage,
  type EmailTemplateName,
} from "@/core/queue/queues/email-queue";
import { logger } from "@/core/logger";

export interface QueueEmailParams {
  to: string;
  subject: string;
  templateName: EmailTemplateName;
  props: Record<string, unknown>;
  userId?: string;
}

export class EmailQueueService {
  constructor(private queue: QueueService = queueService) {}

  async queueEmail(params: QueueEmailParams): Promise<string> {
    const correlationId = crypto.randomUUID();

    const message: EmailQueueMessage = {
      to: params.to,
      subject: params.subject,
      templateName: params.templateName,
      props: params.props,
      metadata: {
        userId: params.userId,
        correlationId,
        attemptedAt: new Date().toISOString(),
      },
    };

    const messageId = await this.queue.publish(EMAIL_QUEUE_NAME, message);

    logger.info("Email queued", {
      messageId,
      to: params.to,
      templateName: params.templateName,
      correlationId,
    });

    return messageId;
  }
}

export const emailQueueService = new EmailQueueService();
