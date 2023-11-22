import { Answer } from '../entities/answer'
import { Instructor } from '../entities/instructor'
import { Question } from '../entities/question'
import { Student } from '../entities/student'

import { AnswersInMemoryRepository } from '../repositories/in-memory/answers-in-memory-repository'
import { AnswerQuestionUseCases } from './answer-question'

let answersRepository: AnswersInMemoryRepository

describe('@use-cases/answer-question', async () => {
  beforeEach(() => {
    answersRepository = new AnswersInMemoryRepository()
  })

  it('should be able to answer a question', async () => {
    const answerQuestion = new AnswerQuestionUseCases(answersRepository)

    const student = Student.create({ name: 'john student' })
    const instructor = Instructor.create({ name: 'john instructor' })

    const question = Question.create({
      title: 'title',
      content: 'description',
      authorId: student.id,
    })

    const { answer } = await answerQuestion.handle({
      questionId: question.id.toString(),
      authorId: instructor.id.toString(),
      content: 'anything',
    })

    expect(answer).toBeInstanceOf(Answer)
    expect(answer.content).toEqual('anything')
  })
})
