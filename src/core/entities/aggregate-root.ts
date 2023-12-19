import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvent: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvent
  }

  public clearEvents() {
    this._domainEvent = []
  }

  protected addDomainEvent(event: DomainEvent) {
    this._domainEvent.push(event)

    // MARK CURRENT CLASS FOR DISPATCH WHENEVER IT CREATES A NEW EVENT
    DomainEvents.markEntityWithEventForDispatch(this)
  }
}
