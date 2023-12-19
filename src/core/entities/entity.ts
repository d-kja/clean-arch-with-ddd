import { UniqueEntityID } from './value-object/unique-entity-id'

export class Entity<Props = unknown> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity: Entity) {
    return this._id.equals(entity._id)
  }
}
