import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeQuestionAttachment } from 'tests/factories/make-question-attachment.factory'
import { makeQuestion } from 'tests/factories/make-question.factory'
import { InMemoryQuestionAttachmentsRepository } from 'tests/in-memory/question-attachments-in-memory-repository'
import { InMemoryQuestionRepository } from 'tests/in-memory/question-in-memory-repository'
import { EditQuestionUseCase } from './edit-question'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('@use-case/delete-question', async () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      questionRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit an existing question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('question'),
    )

    await questionRepository.create(newQuestion)
    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.handle({
      authorId: 'author',
      questionId: 'question',
      title: 'title',
      content: 'content',
      attachmentsIds: ['1', '3'],
    })

    expect(
      questionRepository.items[0].attachments.getCurrentItems(),
    ).toMatchObject([
      {
        attachmentId: new UniqueEntityID('1'),
      },
      {
        attachmentId: new UniqueEntityID('3'),
      },
    ])
  })

  it("shouldn't be able to edit a question made by somebody else", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question'),
    )
    await questionRepository.create(newQuestion)

    const result = await sut.handle({
      authorId: 'author-2',
      questionId: 'question',
      title: 'title',
      content: 'content',
      attachmentsIds: [],
    })

    expect(result.value).toBeInstanceOf(Error)
  })
})
