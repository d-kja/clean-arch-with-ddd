import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { makeAnswer } from "tests/factories/make-answer.factory";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { ListQuestionAnswerUseCase } from "./list-question-answers";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";

let answerRepository: InMemoryAnswersRepository;
let sut: ListQuestionAnswerUseCase;

describe("@use-case/list-question-answers", async () => {
	beforeEach(() => {
		answerRepository = new InMemoryAnswersRepository(
			new InMemoryAnswerAttachmentsRepository(),
		);
		sut = new ListQuestionAnswerUseCase(answerRepository);
	});

	it("should be able to list answers of a specific question", async () => {
		await answerRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID("question-1"),
			}),
		);

		await answerRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID("question-1"),
			}),
		);

		await answerRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID("question-1"),
			}),
		);

		const result = await sut.handle({
			questionId: "question-1",
			page: 1,
		});

		expect(result.value?.answers).toHaveLength(3);
	});

	it("should return a paginated result", async () => {
		for (let index = 1; index <= 22; index++) {
			await answerRepository.create(
				makeAnswer({
					questionId: new UniqueEntityID("question-1"),
				}),
			);
		}

		const result = await sut.handle({
			page: 2,
			questionId: "question-1",
		});

		expect(result.value?.answers).toHaveLength(2);
	});
});
