import { makeNotification } from "tests/factories/make-notification.factory";
import { InMemoryNotificationRepository } from "tests/in-memory/notification-in-memory-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { UnauthorizedError } from "@/core/errors/unauthorized.error";
import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";

let notificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("@use-cases/read-notification", () => {
	beforeEach(() => {
		notificationRepository = new InMemoryNotificationRepository();
		sut = new ReadNotificationUseCase(notificationRepository);
	});

	it("should be able to read a notification", async () => {
		const notification = makeNotification();
		await notificationRepository.create(notification);

		const result = await sut.handle({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(notificationRepository.items[0]).toEqual(
			expect.objectContaining({
				readAt: expect.any(Date),
			}),
		);
	});

	it("should not be able to read a notification from another user", async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityID("original-id"),
		});
		await notificationRepository.create(notification);

		const result = await sut.handle({
			recipientId: "fake-id",
			notificationId: notification.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(UnauthorizedError);
	});
});
