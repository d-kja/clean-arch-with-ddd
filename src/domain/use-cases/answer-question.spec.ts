import { beforeEach, describe, expect, it } from 'vitest'

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

    const student = new Student({ name: 'john student' })
    const instructor = new Instructor({ name: 'john instructor' })

    const question = Question.create({
      title: 'title',
      content: 'description',
      authorId: student.id,
    })

    const { answer } = await answerQuestion.handle({
      questionId: question.id,
      authorId: instructor.id,
      content: 'anything',
    })

    expect(answer).toBeInstanceOf(Answer)
    expect(answer.content).toEqual('anything')
  })
})
