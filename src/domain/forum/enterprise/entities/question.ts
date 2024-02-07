import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id"

import { Slug } from "./object-value/slug"

import { AggregateRoot } from "@/core/entities/aggregate-root"
import { Optional } from "@/core/types/optional"
import { QuestionAttachmentList } from "./question-attachment-list"
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event"

export interface QuestionProps {
	authorId: UniqueEntityID
	bestAnswerId?: UniqueEntityID

	slug: Slug
	title: string
	content: string
	attachments: QuestionAttachmentList

	createdAt: Date
	updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
	get authorId() {
		return this.props.authorId
	}

	get bestAnswerId() {
		return this.props.bestAnswerId
	}

	set bestAnswerId(id: UniqueEntityID | undefined) {
		if (id && id.toString() !== this.props.bestAnswerId?.toString()) {
			this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, id))
		}

		this.props.bestAnswerId = id
		this.touch()
	}

	get slug() {
		return this.props.slug
	}

	get title() {
		return this.props.title
	}

	set title(title: string) {
		this.props.title = title
		this.props.slug = Slug.fromText(title)
		this.touch()
	}

	get content() {
		return this.props.content
	}

	set content(content: string) {
		this.props.content = content
		this.touch()
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...")
	}

	get attachments() {
		return this.props.attachments
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<QuestionProps, "slug" | "createdAt" | "attachments">,
		id?: UniqueEntityID,
	) {
		return new Question(
			{
				...props,
				slug: props.slug ?? Slug.fromText(props.title),
				createdAt: props.createdAt ?? new Date(),
				attachments: props.attachments ?? new QuestionAttachmentList(),
			},
			id,
		)
	}
}
