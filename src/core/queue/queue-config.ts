import { logger } from "@/core/logger";
import type { QueueService, QueueConfig, QueueProvider } from "./queue.interface";
import { createStubQueueService } from "./providers/stub-provider";
import { createSQSQueueService, type SQSConfig } from "./providers/sqs-provider";

export function createQueueService(config: QueueConfig): QueueService {
  const { provider } = config;

  switch (provider) {
    case "stub":
      logger.info("[QueueConfig] Using StubQueueService (in-memory queue)");
      return createStubQueueService();

    case "sqs": {
      const queueUrl = process.env.AWS_SQS_QUEUE_URL;

      if (!queueUrl) {
        throw new Error("AWS_SQS_QUEUE_URL is required for SQS provider");
      }

      const sqsConfig: SQSConfig = {
        region: process.env.AWS_REGION || "us-east-1",
        queueUrl,
        endpoint: process.env.AWS_SQS_ENDPOINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };

      logger.info("[QueueConfig] Using SQS provider", {
        region: sqsConfig.region,
        hasEndpoint: !!sqsConfig.endpoint,
        hasCredentials: !!(sqsConfig.accessKeyId && sqsConfig.secretAccessKey),
      });

      return createSQSQueueService(sqsConfig);
    }

    case "rabbitmq":
      throw new Error("RabbitMQ provider not implemented yet");

    default:
      logger.error(
        `Invalid QUEUE_PROVIDER: ${provider}. Must be 'stub', 'sqs', or 'rabbitmq'`
      );
      throw new Error(
        `Invalid QUEUE_PROVIDER: ${provider}. Must be 'stub', 'sqs', or 'rabbitmq'`
      );
  }
}

export function createQueueServiceFromEnv(): QueueService {
  const provider = (process.env.QUEUE_PROVIDER || "stub") as QueueProvider;

  return createQueueService({ provider });
}

export const queueService = createQueueServiceFromEnv();
