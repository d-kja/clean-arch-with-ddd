import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id"
import { DomainEvent } from "@/core/events/domain-event"
import { Question } from "../entities/question"

export class QuestionBestAnswerChosenEvent implements DomainEvent {
	ocurredAt: Date
	question: Question
	bestAnswerId: UniqueEntityID

	constructor(question: Question, bestAnswerId: UniqueEntityID) {
		this.question = question
		this.bestAnswerId = bestAnswerId
		this.ocurredAt = new Date()
	}

	getId(): UniqueEntityID {
		return this.question.id
	}
}
