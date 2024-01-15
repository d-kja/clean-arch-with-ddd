import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { makeQuestionAttachment } from "tests/factories/make-question-attachment.factory";
import { makeQuestion } from "tests/factories/make-question.factory";
import { InMemoryQuestionAttachmentsRepository } from "tests/in-memory/question-attachments-in-memory-repository";
import { InMemoryQuestionRepository } from "tests/in-memory/question-in-memory-repository";
import { DeleteQuestionUseCase } from "./delete-question";

let questionRepository: InMemoryQuestionRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("@use-case/delete-question", async () => {
	beforeEach(() => {
		questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentsRepository,
		);

		sut = new DeleteQuestionUseCase(questionRepository);
	});

	it("should be able to delete an existing question", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author"),
			},
			new UniqueEntityID("question"),
		);

		await questionRepository.create(newQuestion);
		questionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("2"),
			}),
		);

		const result = await sut.handle({
			authorId: "author",
			questionId: "question",
		});

		expect(result.isRight()).toBe(true);
		expect(questionRepository.items).toHaveLength(0);
		expect(questionAttachmentsRepository.items).toHaveLength(0);
	});

	it("shouldn't be able to delete a question made by somebody else", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question"),
		);
		await questionRepository.create(newQuestion);

		const result = await sut.handle({
			authorId: "author-2",
			questionId: "question",
		});

		expect(result.value).toBeInstanceOf(Error);
	});
});
