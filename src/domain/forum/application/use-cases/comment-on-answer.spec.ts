import { makeAnswer } from "tests/factories/make-answer.factory";
import { InMemoryAnswerCommentRepository } from "tests/in-memory/answer-comments-in-memory-repository";
import { InMemoryAnswersRepository } from "tests/in-memory/answers-in-memory-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerAttachmentsRepository } from "tests/in-memory/answer-attachments-repository";

let answerRepository: InMemoryAnswersRepository;
let answerCommentRepository: InMemoryAnswerCommentRepository;
let sut: CommentOnAnswerUseCase;

describe("@use-case/comment-on-answer", async () => {
	beforeEach(() => {
		answerRepository = new InMemoryAnswersRepository(
			new InMemoryAnswerAttachmentsRepository(),
		);
		answerCommentRepository = new InMemoryAnswerCommentRepository();

		sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepository);
	});

	it("should be able to comment on a answer", async () => {
		const answer = makeAnswer();
		await answerRepository.create(answer);

		const result = await sut.handle({
			answerId: answer.id.toString(),
			authorId: "author-id",
			content: "content",
		});

		if (result.isLeft()) throw new Error("invalid test");

		expect(result.value.answerComment.id).toBeTruthy();
		expect(answerCommentRepository.items[0].authorId.toString()).toEqual(
			"author-id",
		);
	});
});
