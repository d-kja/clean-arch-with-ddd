import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private _id: string

  toString() {
    return this._id
  }

  constructor(id?: string) {
    this._id = id ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return this._id === id.toString()
  }
}
