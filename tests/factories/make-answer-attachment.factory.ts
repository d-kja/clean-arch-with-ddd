import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import {
	AnswerAttachment,
	AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
	props?: Partial<AnswerAttachmentProps>,
	id?: UniqueEntityID,
) {
	return AnswerAttachment.create(
		{
			attachmentId: new UniqueEntityID(),
			answerId: new UniqueEntityID(),
			...props,
		},
		id,
	);
}
