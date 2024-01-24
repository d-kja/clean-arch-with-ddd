import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id"
import { DomainEvent } from "@/core/events/domain-event"
import { Answer } from "../entities/answer"

export class AnswerCreatedEvent implements DomainEvent {
	public ocurredAt: Date
	public item: Answer

	constructor(answer: Answer) {
		this.item = answer
		this.ocurredAt = new Date()
	}

	public getId(): UniqueEntityID {
		return this.item.id
	}
}
