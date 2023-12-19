import { UniqueEntityID } from '../entities/value-object/unique-entity-id'

export abstract class DomainEvent {
  abstract ocurredAt: Date
  abstract getId(): UniqueEntityID
}
