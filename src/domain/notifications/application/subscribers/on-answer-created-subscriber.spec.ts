import { OnAnswerCreated } from "./on-answer-created-subscriber"
import { makeAnswer } from "tests/factories/make-answer.factory"
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository"
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository"
import {
	SendNotificationRequest,
	SendNotificationResponse,
	SendNotificationUseCase,
} from "../use-case/send-notification"
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository"
import { InMemoryQuestionRepository } from "tests/in-memory/question-in-memory-repository"
import { NotificationRepository } from "../repositories/notification-repository"
import { InMemoryNotificationRepository } from "tests/in-memory/notification-in-memory-repository"
import { InMemoryQuestionAttachmentsRepository } from "tests/in-memory/question-attachments-in-memory-repository"
import { makeQuestion } from "tests/factories/make-question.factory"
import { waitFor } from "tests/utils/wait-for"
import { SpyInstance } from "vitest"

let answersRepository: InMemoryAnswersRepository
let sendNotification: SendNotificationUseCase
let questionRepository: InMemoryQuestionRepository
let notificationRepository: InMemoryNotificationRepository

let useCaseSpy: SpyInstance<
	[SendNotificationRequest],
	Promise<SendNotificationResponse>
>

describe("@subscriber/on-answer-created", () => {
	beforeEach(() => {
		answersRepository = new InMemoryAnswersRepository(
			new InMemoryAnswerAttachmentsRepository(),
		)

		notificationRepository = new InMemoryNotificationRepository()
		questionRepository = new InMemoryQuestionRepository(
			new InMemoryQuestionAttachmentsRepository(),
		)

		sendNotification = new SendNotificationUseCase(notificationRepository)
		useCaseSpy = vi.spyOn(sendNotification, "handle")

		// Creating subscriber for the event
		new OnAnswerCreated(questionRepository, sendNotification)
	})

	it("should send a notification when an answer is created", async () => {
		const question = makeQuestion()
		await questionRepository.create(question)

		const answer = makeAnswer({
			questionId: question.id,
		})

		// Event was created and stored in the waiting list
		expect(answer.domainEvents).toHaveLength(1)

		// Published after persistence
		answersRepository.create(answer)

		// Waiting list was cleared after persisting the data and publishing the event
		expect(answer.domainEvents).toHaveLength(0)
		waitFor(() => expect(notificationRepository.items).toHaveLength(1))
		waitFor(() => expect(useCaseSpy).toHaveBeenCalled())
	})
})
