import { makeQuestion } from "tests/factories/make-question.factory";
import { InMemoryQuestionCommentRepository } from "tests/in-memory/question-comments-in-memory-repository";
import { InMemoryQuestionRepository } from "tests/in-memory/question-in-memory-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "tests/in-memory/question-attachments-in-memory-repository";

let questionRepository: InMemoryQuestionRepository;
let questionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe("@use-case/comment-on-question", async () => {
	beforeEach(() => {
		questionRepository = new InMemoryQuestionRepository(
			new InMemoryQuestionAttachmentsRepository(),
		);
		questionCommentRepository = new InMemoryQuestionCommentRepository();

		sut = new CommentOnQuestionUseCase(
			questionRepository,
			questionCommentRepository,
		);
	});

	it("should be able to comment on a question", async () => {
		const question = makeQuestion();
		await questionRepository.create(question);

		const result = await sut.handle({
			questionId: question.id.toString(),
			authorId: "author-id",
			content: "content",
		});

		if (result.isLeft()) throw new Error("invalid test");

		expect(result.value.questionComment.id).toBeTruthy();
		expect(questionCommentRepository.items[0].authorId.toString()).toEqual(
			"author-id",
		);
	});
});
