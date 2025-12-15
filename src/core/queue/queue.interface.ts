export interface QueueMessage<T = unknown> {
  id: string;
  queue: string;
  data: T;
  timestamp: Date;
  retryCount?: number;
}

export interface PublishOptions {
  delay?: number;
  priority?: number;
  retries?: number;
}

export interface SubscribeOptions {
  concurrency?: number;
}

export type MessageHandler<T> = (message: QueueMessage<T>) => Promise<void>;

export interface QueueService {
  publish<T>(queue: string, data: T, options?: PublishOptions): Promise<string>;
  subscribe<T>(
    queue: string,
    handler: MessageHandler<T>,
    options?: SubscribeOptions
  ): void;
  unsubscribe(queue: string): void;
  close(): Promise<void>;
}

export type QueueProvider = 'stub' | 'sqs' | 'rabbitmq';

export interface QueueConfig {
  provider: QueueProvider;
}
