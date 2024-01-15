import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { UnauthorizedError } from "@/core/errors/unauthorized.error";
import { makeAnswer } from "tests/factories/make-answer.factory";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";
import { makeAnswerAttachment } from "tests/factories/make-answer-attachment.factory";

let answerRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe("@use-case/delete-answer", async () => {
	beforeEach(() => {
		answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		answerRepository = new InMemoryAnswersRepository(
			answerAttachmentsRepository,
		);
		sut = new DeleteAnswerUseCase(answerRepository);
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

		const result = await sut.handle({
			authorId: "author",
			answerId: "answer",
		});

		expect(result.isRight()).toBe(true);
		expect(answerRepository.items).toHaveLength(0);
		expect(answerAttachmentsRepository.items).toHaveLength(0);
	});

	it("shouldn't be able to delete a answer made by somebody else", async () => {
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
		});

		expect(result.value).toBeInstanceOf(UnauthorizedError);
	});
});
