import { DomainEvent } from "@/core/events/domain-event"
import { DomainEvents } from "@/core/events/domain-events"
import { PaginationParams } from "@/core/repository/pagination-params"
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository"
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository"
import { Answer } from "@/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswersRepository {
	items: Answer[] = []

	constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer)

		DomainEvents.dispatchEventsForEntity(answer.id)
	}

	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		)

		if (answerIndex > -1) {
			this.items.splice(answerIndex, 1)
		}

		await this.answerAttachmentRepository.deleteManyByAnswerId(
			answer.id.toString(),
		)
	}

	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		)

		this.items[answerIndex] = answer
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((item) => item.id.toString() === id)

		if (!answer) return null

		return answer
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const perPage = 20

		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * perPage, page * perPage)

		return answers
	}
}
