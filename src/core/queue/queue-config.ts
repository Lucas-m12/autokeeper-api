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
      const sqsConfig: SQSConfig = {
        region: process.env.AWS_REGION || "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        endpoint: process.env.AWS_SQS_ENDPOINT,
        queueUrlPrefix: process.env.AWS_SQS_QUEUE_URL_PREFIX!,
      };

      if (!sqsConfig.accessKeyId || !sqsConfig.secretAccessKey) {
        throw new Error(
          "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required for SQS provider"
        );
      }

      if (!sqsConfig.queueUrlPrefix) {
        throw new Error("AWS_SQS_QUEUE_URL_PREFIX is required for SQS provider");
      }

      logger.info("[QueueConfig] Using SQS provider", {
        region: sqsConfig.region,
        hasEndpoint: !!sqsConfig.endpoint,
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
