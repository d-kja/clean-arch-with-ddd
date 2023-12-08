// left/error ----> right/success

export class Left<LeftType, RightType> {
  readonly value: LeftType

  constructor(value: LeftType) {
    this.value = value
  }

  static create<LeftType, RightType = unknown>(value: LeftType) {
    return new Left<LeftType, RightType>(value)
  }

  isLeft(): this is Left<LeftType, RightType> {
    return true
  }

  isRight(): this is Right<LeftType, RightType> {
    return false
  }
}

export class Right<LeftType, RightType> {
  readonly value: RightType

  constructor(value: RightType) {
    this.value = value
  }

  static create<RightType, LeftType = unknown>(value: RightType) {
    return new Right<LeftType, RightType>(value)
  }

  isLeft(): this is Left<LeftType, RightType> {
    return false
  }

  isRight(): this is Right<LeftType, RightType> {
    return true
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>
