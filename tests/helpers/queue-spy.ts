import type {
  QueueService,
  PublishOptions,
  MessageHandler,
  SubscribeOptions,
} from "@/core/queue";

export interface PublishCall<T = unknown> {
  queue: string;
  data: T;
  options?: PublishOptions;
}

export function createQueueSpy(): QueueService & {
  publishCalls: PublishCall[];
  reset: () => void;
} {
  const publishCalls: PublishCall[] = [];
  let messageIdCounter = 0;

  return {
    publishCalls,

    async publish<T>(
      queue: string,
      data: T,
      options?: PublishOptions
    ): Promise<string> {
      publishCalls.push({ queue, data, options });
      messageIdCounter++;
      return `test-message-id-${messageIdCounter}`;
    },

    subscribe<T>(
      _queue: string,
      _handler: MessageHandler<T>,
      _options?: SubscribeOptions
    ): void {},

    unsubscribe(_queue: string): void {},

    async close(): Promise<void> {},

    reset(): void {
      publishCalls.length = 0;
      messageIdCounter = 0;
    },
  };
}
