import { logger } from "@/core/logger";
import { queueService, type QueueMessage } from "@/core/queue";
import {
  EMAIL_QUEUE_NAME,
  type EmailQueueMessage,
} from "@/core/queue/queues/email-queue";
import { emailService } from "@/modules/channels/infra/email";
import { getEmailTemplate } from "@/modules/channels/infra/email/template-registry";

const SHUTDOWN_TIMEOUT_MS = 30000;

async function processEmailMessage(
  message: QueueMessage<EmailQueueMessage>
): Promise<void> {
  const { data } = message;

  logger.info("Processing email", {
    messageId: message.id,
    to: data.to,
    templateName: data.templateName,
    correlationId: data.metadata?.correlationId,
  });

  const template = getEmailTemplate(data.templateName);

  await emailService.send({
    to: data.to,
    subject: data.subject,
    template,
    props: data.props,
  });

  logger.info("Email sent successfully", {
    messageId: message.id,
    to: data.to,
    templateName: data.templateName,
    correlationId: data.metadata?.correlationId,
  });
}

async function main() {
  logger.info("Email worker starting", {
    queueProvider: process.env.QUEUE_PROVIDER,
    emailProvider: process.env.EMAIL_PROVIDER,
  });

  queueService.subscribe<EmailQueueMessage>(
    EMAIL_QUEUE_NAME,
    processEmailMessage,
    { concurrency: 5 }
  );

  logger.info("Email worker listening", { queue: EMAIL_QUEUE_NAME });

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    const timeout = setTimeout(() => {
      logger.error("Graceful shutdown timeout, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    try {
      queueService.unsubscribe(EMAIL_QUEUE_NAME);
      await queueService.close();
      clearTimeout(timeout);
      logger.info("Worker shutdown complete");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", {
        error: error instanceof Error ? error.message : String(error),
      });
      clearTimeout(timeout);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  logger.error("Email worker failed to start", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
