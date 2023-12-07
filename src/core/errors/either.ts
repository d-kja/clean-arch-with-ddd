// left/error ----> right/success

export class Left<LeftType> {
  readonly value: LeftType

  constructor(value: LeftType) {
    this.value = value
  }

  static create<LeftType>(value: LeftType) {
    return new Left(value)
  }

  isLeft() {
    return true
  }

  isRight() {
    return false
  }
}

export class Right<RightType> {
  readonly value: RightType

  constructor(value: RightType) {
    this.value = value
  }

  static create<RightType>(value: RightType) {
    return new Right(value)
  }

  isLeft() {
    return false
  }

  isRight() {
    return true
  }
}

export type Either<L, R> = Left<L> | Right<R>
