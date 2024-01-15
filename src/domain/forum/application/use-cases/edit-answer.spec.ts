import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { makeAnswer } from "tests/factories/make-answer.factory";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";
import { makeAnswerAttachment } from "tests/factories/make-answer-attachment.factory";

let answerRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("@use-case/delete-answer", async () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new EditAnswerUseCase(answerRepository, answerAttachmentsRepository);
	});

	it("should be able to delete an existing answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author"),
			},
			new UniqueEntityID("answer"),
		);
		await answerRepository.create(newAnswer);
		answerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("2"),
			}),
		);

		await sut.handle({
			authorId: "author",
			answerId: "answer",
			content: "content",
			attachmentIds: [],
		});

		expect(answerRepository.items[0]).toMatchObject({
			content: "content",
		});
	});

	it("shouldn't be able to edit a answer made by somebody else", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer"),
		);
		await answerRepository.create(newAnswer);

		const result = await sut.handle({
			authorId: "author-2",
			answerId: "answer",
			content: "content",
			attachmentIds: [],
		});

		expect(result.value).toBeInstanceOf(Error);
	});
});
