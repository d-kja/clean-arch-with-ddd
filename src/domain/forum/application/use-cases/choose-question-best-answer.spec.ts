import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";

import { UnauthorizedError } from "@/core/errors/unauthorized.error";
import { makeAnswer } from "tests/factories/make-answer.factory";
import { makeQuestion } from "tests/factories/make-question.factory";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { InMemoryQuestionAttachmentsRepository } from "tests/in-memory/question-attachments-in-memory-repository";
import { InMemoryQuestionRepository } from "tests/in-memory/question-in-memory-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";

let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let questionRepository: InMemoryQuestionRepository;
let answerRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("@use-case/choose-question-best-answer", async () => {
	beforeEach(() => {
		questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(
			questionAttachmentRepository,
		);
		answerRepository = new InMemoryAnswersRepository(
			new InMemoryAnswerAttachmentsRepository(),
		);
		sut = new ChooseQuestionBestAnswerUseCase(
			questionRepository,
			answerRepository,
		);
	});

	it("should be able to choose the best answer of a question", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID("author"),
		});
		const newAnswer = makeAnswer(
			{
				questionId: newQuestion.id,
			},
			new UniqueEntityID("answer-id"),
		);

		await questionRepository.create(newQuestion);
		await answerRepository.create(newAnswer);

		await sut.handle({
			answerId: "answer-id",
			authorId: "author",
		});

		expect(questionRepository.items[0].bestAnswerId).toEqual(newAnswer.id);
	});

	it("shouldn't be able to choose the best answer of a question from another user", async () => {
		const newQuestion = makeQuestion({
			authorId: new UniqueEntityID("author"),
		});
		const newAnswer = makeAnswer(
			{
				questionId: newQuestion.id,
			},
			new UniqueEntityID("answer-id"),
		);

		await questionRepository.create(newQuestion);
		await answerRepository.create(newAnswer);

		const result = await sut.handle({
			answerId: "answer-id",
			authorId: "fake-author",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(UnauthorizedError);
	});
});
