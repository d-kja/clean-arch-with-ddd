import { makeQuestion } from 'tests/factories/make-question.factory'
import { InMemoryQuestionRepository } from 'tests/in-memory/question-in-memory-repository'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let questionRepository: InMemoryQuestionRepository
let sut: ListRecentQuestionsUseCase

describe('@use-case/list-recent-questions', async () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new ListRecentQuestionsUseCase(questionRepository)
  })

  it('should be able to list the recent questions', async () => {
    vi.useFakeTimers()

    vi.setSystemTime(new Date(2023, 0, 10))
    await questionRepository.create(makeQuestion({}))

    vi.setSystemTime(new Date(2023, 0, 15))
    await questionRepository.create(makeQuestion({}))

    vi.setSystemTime(new Date(2023, 0, 20))
    await questionRepository.create(makeQuestion({}))

    const { questions } = await sut.handle({
      page: 1,
    })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 15),
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 10),
      }),
    ])

    vi.useRealTimers()
  })

  it('should return a paginated result', async () => {
    for (let index = 1; index <= 22; index++) {
      await questionRepository.create(makeQuestion({}))
    }

    const { questions } = await sut.handle({
      page: 2,
    })

    expect(questions).toHaveLength(2)
  })
})
