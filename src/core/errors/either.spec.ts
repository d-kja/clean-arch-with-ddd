import { EmptyObject } from '../types/generic-types'
import { Either, Left, Right } from './either'

type HandleSomethingProps = {
  shouldSucceed?: boolean
}

function handleSomething({
  shouldSucceed = true,
}: HandleSomethingProps): Either<Error, EmptyObject> {
  if (shouldSucceed) {
    return Right.create({})
  }

  return Left.create(new Error())
}

test('It should Either succeed or fail depending on the return type', () => {
  let result = handleSomething({ shouldSucceed: true })

  expect(result.isRight()).toBeTruthy()
  expect(result.isLeft()).toBeFalsy()

  expect(result.value).toEqual({})

  result = handleSomething({ shouldSucceed: false })

  expect(result.isLeft()).toBeTruthy()
  expect(result.isRight()).toBeFalsy()

  expect(result.value).toBeInstanceOf(Error)
})
