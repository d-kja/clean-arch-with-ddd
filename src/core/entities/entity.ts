import { UniqueEntityID } from './value-object/unique-entity-id'

export class Entity<Props = any> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  constructor(props: Props, id?: string) {
    this.props = props
    this._id = new UniqueEntityID(id)
  }
}
