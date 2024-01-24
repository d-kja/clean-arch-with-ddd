import { DomainEvent } from "@/core/events/domain-event"
import { DomainEvents } from "@/core/events/domain-events"
import { EventHandler } from "@/core/events/event-handler"
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event"

export class OnAnswerCreated implements EventHandler {
	constructor() {
		this.setupSubscription()
	}

	setupSubscription(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification,
			AnswerCreatedEvent.name,
		)
	}

	private async sendNewAnswerNotification() {}
}
