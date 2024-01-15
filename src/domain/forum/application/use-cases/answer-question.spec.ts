import { Instructor } from "../../enterprise/entities/instructor";
import { Question } from "../../enterprise/entities/question";
import { Student } from "../../enterprise/entities/student";

import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { AnswerQuestionUseCases } from "./answer-question";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";

let answersRepository: InMemoryAnswersRepository;
let answersAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let answerQuestion: AnswerQuestionUseCases;

describe("@use-cases/answer-question", async () => {
	beforeEach(() => {
		answersAttachmentRepository = new InMemoryAnswerAttachmentsRepository();
		answersRepository = new InMemoryAnswersRepository(
			answersAttachmentRepository,
		);
		answerQuestion = new AnswerQuestionUseCases(answersRepository);
	});

	it("should be able to answer a question", async () => {
		const student = Student.create({ name: "john student" });
		const instructor = Instructor.create({ name: "john instructor" });

		const question = Question.create({
			title: "title",
			content: "description",
			authorId: student.id,
		});

		const result = await answerQuestion.handle({
			questionId: question.id.toString(),
			authorId: instructor.id.toString(),
			content: "anything",
			attachmentIds: ["1", "2"],
		});

		if (result.isLeft()) throw new Error("invalid test");

		expect(result.value.answer.id).toBeInstanceOf(UniqueEntityID);
		expect(answersRepository.items).toHaveLength(1);

		expect(answersRepository.items[0]).toEqual(result.value?.answer);
		expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(answersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
		]);
	});
});
