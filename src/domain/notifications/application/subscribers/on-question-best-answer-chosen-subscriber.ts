import { EventHandler } from "@/core/events/event-handler"
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository"
import { SendNotificationUseCase } from "../use-case/send-notification"
import { DomainEvents } from "@/core/events/domain-events"
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event"

export class OnQuestionBestAnswerChosenSubscriber implements EventHandler {
	constructor(
		private answerRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {}

	setupSubscription(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		)
	}

	private async sendQuestionBestAnswerNotification(
		event: QuestionBestAnswerChosenEvent,
	) {
		const answer = await this.answerRepository.findById(
			event.bestAnswerId.toString(),
		)

		if (!answer) return

		await this.sendNotification.handle({
			recipientId: answer.authorId.toString(),
			title: "Your answer has been chosen!",
			content: `The owner of the question ${event.question.title
				.slice(0, 40)
				.concat("...")} has chosen your answer`,
		})
	}
}
