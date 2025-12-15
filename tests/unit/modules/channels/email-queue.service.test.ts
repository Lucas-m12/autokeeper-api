import { describe, expect, it, beforeEach } from "bun:test";
import { EmailQueueService } from "@/modules/channels/infra/email/email-queue.service";
import { EMAIL_QUEUE_NAME } from "@/core/queue/queues/email-queue";
import { createQueueSpy } from "../../../helpers/queue-spy";

describe("EmailQueueService", () => {
  let queueSpy: ReturnType<typeof createQueueSpy>;
  let emailQueueService: EmailQueueService;

  beforeEach(() => {
    queueSpy = createQueueSpy();
    emailQueueService = new EmailQueueService(queueSpy);
  });

  describe("queueEmail", () => {
    it("should publish email to the correct queue", async () => {
      // Arrange
      const params = {
        to: "test@example.com",
        subject: "Test Subject",
        templateName: "otp-verification" as const,
        props: { otp: "123456" },
      };

      // Act
      await emailQueueService.queueEmail(params);

      // Assert
      expect(queueSpy.publishCalls).toHaveLength(1);
      expect(queueSpy.publishCalls[0].queue).toBe(EMAIL_QUEUE_NAME);
    });

    it("should return a message ID", async () => {
      // Arrange
      const params = {
        to: "test@example.com",
        subject: "Test Subject",
        templateName: "password-reset" as const,
        props: { otp: "654321" },
      };

      // Act
      const messageId = await emailQueueService.queueEmail(params);

      // Assert
      expect(messageId).toBeDefined();
      expect(typeof messageId).toBe("string");
    });

    it("should include all email params in the message", async () => {
      // Arrange
      const params = {
        to: "user@test.com",
        subject: "Welcome",
        templateName: "welcome" as const,
        props: { userName: "John" },
        userId: "user-123",
      };

      // Act
      await emailQueueService.queueEmail(params);

      // Assert
      const message = queueSpy.publishCalls[0].data;
      expect(message.to).toBe(params.to);
      expect(message.subject).toBe(params.subject);
      expect(message.templateName).toBe(params.templateName);
      expect(message.props).toEqual(params.props);
    });

    it("should include metadata with correlationId and attemptedAt", async () => {
      // Arrange
      const params = {
        to: "test@example.com",
        subject: "Test",
        templateName: "otp-verification" as const,
        props: {},
        userId: "user-456",
      };

      // Act
      await emailQueueService.queueEmail(params);

      // Assert
      const message = queueSpy.publishCalls[0].data;
      expect(message.metadata).toBeDefined();
      expect(message.metadata.correlationId).toBeDefined();
      expect(message.metadata.attemptedAt).toBeDefined();
      expect(message.metadata.userId).toBe(params.userId);
    });
  });
});
