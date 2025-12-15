import { uuidv7 } from "uuidv7";
import { logger } from "@/core/logger";
import type {
  QueueService,
  QueueMessage,
  MessageHandler,
  PublishOptions,
  SubscribeOptions,
} from "../queue.interface";

export function createStubQueueService(): QueueService {
  const queues = new Map<string, QueueMessage[]>();
  const handlers = new Map<string, MessageHandler<unknown>>();

  return {
    async publish<T>(
      queue: string,
      data: T,
      _options?: PublishOptions
    ): Promise<string> {
      const message: QueueMessage<T> = {
        id: uuidv7(),
        queue,
        data,
        timestamp: new Date(),
        retryCount: 0,
      };

      const handler = handlers.get(queue);
      if (handler) {
        await handler(message as QueueMessage<unknown>);
      } else {
        const queueMessages = queues.get(queue) || [];
        queueMessages.push(message as QueueMessage<unknown>);
        queues.set(queue, queueMessages);
      }

      logger.debug("Queue message published", { queue, id: message.id });
      return message.id;
    },

    subscribe<T>(
      queue: string,
      handler: MessageHandler<T>,
      _options?: SubscribeOptions
    ): void {
      handlers.set(queue, handler as MessageHandler<unknown>);
      logger.debug("Queue handler subscribed", { queue });

      const pending = queues.get(queue) || [];
      if (pending.length > 0) {
        logger.debug("Processing pending messages", {
          queue,
          count: pending.length,
        });
        pending.forEach((msg) => handler(msg as QueueMessage<T>));
        queues.set(queue, []);
      }
    },

    unsubscribe(queue: string): void {
      handlers.delete(queue);
      logger.debug("Queue handler unsubscribed", { queue });
    },

    async close(): Promise<void> {
      handlers.clear();
      queues.clear();
      logger.debug("Queue service closed");
    },
  };
}
