import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  type SQSClientConfig,
} from "@aws-sdk/client-sqs";
import { uuidv7 } from "uuidv7";
import { logger } from "@/core/logger";
import type {
  QueueService,
  QueueMessage,
  MessageHandler,
  PublishOptions,
  SubscribeOptions,
} from "../queue.interface";

export interface SQSConfig {
  region: string;
  queueUrl: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export function createSQSQueueService(config: SQSConfig): QueueService {
  const clientConfig: SQSClientConfig = {
    region: config.region,
  };

  if (config.accessKeyId && config.secretAccessKey) {
    clientConfig.credentials = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    };
  }

  if (config.endpoint) {
    clientConfig.endpoint = config.endpoint;
  }

  const client = new SQSClient(clientConfig);
  const subscriptions = new Map<
    string,
    { polling: boolean; handler: MessageHandler<unknown> }
  >();

  const getQueueUrl = (_queueName: string) => config.queueUrl;

  return {
    async publish<T>(
      queue: string,
      data: T,
      options?: PublishOptions
    ): Promise<string> {
      const messageId = uuidv7();
      const message: QueueMessage<T> = {
        id: messageId,
        queue,
        data,
        timestamp: new Date(),
        retryCount: 0,
      };

      const command = new SendMessageCommand({
        QueueUrl: getQueueUrl(queue),
        MessageBody: JSON.stringify(message),
        DelaySeconds: options?.delay
          ? Math.floor(options.delay / 1000)
          : undefined,
      });

      await client.send(command);
      logger.debug("SQS message published", { queue, messageId });
      return messageId;
    },

    subscribe<T>(
      queue: string,
      handler: MessageHandler<T>,
      options?: SubscribeOptions
    ): void {
      const concurrency = options?.concurrency ?? 1;
      const queueUrl = getQueueUrl(queue);

      subscriptions.set(queue, {
        polling: true,
        handler: handler as MessageHandler<unknown>,
      });

      const poll = async () => {
        const subscription = subscriptions.get(queue);
        if (!subscription?.polling) return;

        try {
          const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: Math.min(concurrency, 10),
            WaitTimeSeconds: 20,
            VisibilityTimeout: 30,
          });

          const response = await client.send(command);

          if (response.Messages) {
            for (const sqsMessage of response.Messages) {
              try {
                const message = JSON.parse(
                  sqsMessage.Body!
                ) as QueueMessage<T>;
                message.timestamp = new Date(message.timestamp);

                await handler(message);

                await client.send(
                  new DeleteMessageCommand({
                    QueueUrl: queueUrl,
                    ReceiptHandle: sqsMessage.ReceiptHandle!,
                  })
                );

                logger.debug("SQS message processed", {
                  queue,
                  messageId: message.id,
                });
              } catch (error) {
                logger.error("Error processing SQS message", {
                  queue,
                  messageId: sqsMessage.MessageId,
                  error:
                    error instanceof Error ? error.message : String(error),
                });
              }
            }
          }
        } catch (error) {
          logger.error("Error polling SQS queue", {
            queue,
            error: error instanceof Error ? error.message : String(error),
          });
        }

        setImmediate(poll);
      };

      logger.info("SQS subscription started", { queue });
      poll();
    },

    unsubscribe(queue: string): void {
      const subscription = subscriptions.get(queue);
      if (subscription) {
        subscription.polling = false;
        subscriptions.delete(queue);
        logger.info("SQS subscription stopped", { queue });
      }
    },

    async close(): Promise<void> {
      for (const [queue] of subscriptions) {
        this.unsubscribe(queue);
      }
      client.destroy();
      logger.info("SQS client closed");
    },
  };
}
