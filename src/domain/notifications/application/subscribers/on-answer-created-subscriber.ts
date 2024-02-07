import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository"
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event"
import { SendNotificationUseCase } from "../use-case/send-notification"

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscription()
	}

	setupSubscription(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this), // bind current instance for future use in other classes
			AnswerCreatedEvent.name,
		)
	}

	private async sendNewAnswerNotification(event: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			event.item.questionId.toString(),
		)

		if (!question) return

		await this.sendNotification.handle({
			recipientId: question.authorId.toString(),
			title: `A new answer was created on ${question.title
				.slice(0, 40)
				.concat("...")}`,
			content: event.item.excerpt,
		})
	}
}
