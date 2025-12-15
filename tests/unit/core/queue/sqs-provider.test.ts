import { describe, expect, it, mock, beforeEach } from "bun:test";
import { createSQSQueueService, type SQSConfig } from "@/core/queue/providers/sqs-provider";

const mockSend = mock(() => Promise.resolve({}));

mock.module("@aws-sdk/client-sqs", () => ({
  SQSClient: class {
    send = mockSend;
    destroy = mock(() => {});
  },
  SendMessageCommand: class {
    constructor(public input: unknown) {}
  },
  ReceiveMessageCommand: class {
    constructor(public input: unknown) {}
  },
  DeleteMessageCommand: class {
    constructor(public input: unknown) {}
  },
}));

describe("SQS Provider", () => {
  const config: SQSConfig = {
    region: "us-east-1",
    accessKeyId: "test-key",
    secretAccessKey: "test-secret",
    queueUrlPrefix: "http://localhost:4566/000000000000",
  };

  beforeEach(() => {
    mockSend.mockClear();
  });

  describe("publish", () => {
    it("should send message to correct queue URL", async () => {
      // Arrange
      const queueService = createSQSQueueService(config);
      const queueName = "test-queue";
      const data = { foo: "bar" };

      // Act
      await queueService.publish(queueName, data);

      // Assert
      expect(mockSend).toHaveBeenCalledTimes(1);
      const command = mockSend.mock.calls[0][0];
      expect(command.input.QueueUrl).toBe(
        `${config.queueUrlPrefix}/${queueName}`
      );
    });

    it("should return a message ID", async () => {
      // Arrange
      const queueService = createSQSQueueService(config);

      // Act
      const messageId = await queueService.publish("test-queue", { test: true });

      // Assert
      expect(messageId).toBeDefined();
      expect(typeof messageId).toBe("string");
    });

    it("should include message body with correct structure", async () => {
      // Arrange
      const queueService = createSQSQueueService(config);
      const data = { email: "test@example.com" };

      // Act
      await queueService.publish("email-queue", data);

      // Assert
      const command = mockSend.mock.calls[0][0];
      const body = JSON.parse(command.input.MessageBody);
      expect(body.data).toEqual(data);
      expect(body.queue).toBe("email-queue");
      expect(body.id).toBeDefined();
      expect(body.timestamp).toBeDefined();
      expect(body.retryCount).toBe(0);
    });

    it("should convert delay option from ms to seconds", async () => {
      // Arrange
      const queueService = createSQSQueueService(config);

      // Act
      await queueService.publish("test-queue", {}, { delay: 5000 });

      // Assert
      const command = mockSend.mock.calls[0][0];
      expect(command.input.DelaySeconds).toBe(5);
    });
  });
});
