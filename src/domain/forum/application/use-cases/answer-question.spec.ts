import { Instructor } from '../../enterprise/entities/instructor'
import { Question } from '../../enterprise/entities/question'
import { Student } from '../../enterprise/entities/student'

import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { InMemoryAnswersRepository } from 'tests/in-memory/answers-in-memory-repository'
import { AnswerQuestionUseCases } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let answerQuestion: AnswerQuestionUseCases

describe('@use-cases/answer-question', async () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerQuestion = new AnswerQuestionUseCases(answersRepository)
  })

  it('should be able to answer a question', async () => {
    const student = Student.create({ name: 'john student' })
    const instructor = Instructor.create({ name: 'john instructor' })

    const question = Question.create({
      title: 'title',
      content: 'description',
      authorId: student.id,
    })

    const result = await answerQuestion.handle({
      questionId: question.id.toString(),
      authorId: instructor.id.toString(),
      content: 'anything',
    })

    if (result.isLeft()) throw new Error('invalid test')

    expect(result.value.answer.id).toBeInstanceOf(UniqueEntityID)
    expect(answersRepository.items).toHaveLength(1)
  })
})
