import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/value-object/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void
type GenericEntityType = AggregateRoot<unknown>

export class DomainEvents {
  // EVENTS IN THE WAITING LIST
  private static markedEntityWithEvents: GenericEntityType[] = []
  // CALLBACKS TO PUBLISH EVENTS (HANDLER MAP)
  private static eventCallbacks: Record<string, DomainEventCallback[]> = {}

  // WHENEVER A NEW EVENT IS CREATED IN AN ENTITY CLASS IT PUSHES TO THE LIST THE CURRENT CLASS WITH EVENTS AVAILABLE
  public static markEntityWithEventForDispatch(entity: GenericEntityType) {
    const entityFound = this.findMarkedEntityById(entity.id)
    const doesEntityExist = !!entityFound

    if (!doesEntityExist) {
      this.markedEntityWithEvents.push(entity)
    }
  }

  // USE THE EVENT CALLBACK HANDLERS OF THAT SPECIFIC ENTITY WHENEVER THE EVENT IS READY TO BE PUBLISHED
  private static dispatchEntityEvents(entity: GenericEntityType) {
    entity.domainEvents.forEach((domainEvent: DomainEvent) => {
      this.dispatch(domainEvent)
    })
  }

  public static dispatchEventsForEntity(id: UniqueEntityID) {
    const entity = this.findMarkedEntityById(id)

    if (entity) {
      this.dispatchEntityEvents(entity)

      // CLEAN UP
      entity.clearEvents()
      this.removeEntityFromMarkedDispatchList(entity)
    }
  }

  //
  // CORE
  //

  public static register(callbackFn: DomainEventCallback, eventName: string) {
    const wasEventAlreadyRegistered = eventName in this.eventCallbacks

    // WASN'T THERE, THEN ADD
    if (!wasEventAlreadyRegistered) {
      this.eventCallbacks[eventName] = []
    }

    // WAS/WASN'T, EITHER WAY PUSH A NEW EVENT FOR THAT SPECIFIC EVENT TYPE
    this.eventCallbacks[eventName].push(callbackFn)
  }

  private static dispatch(event: DomainEvent) {
    const eventName = event.constructor.name
    const isEventAlreadyRegistered = eventName in this.eventCallbacks

    if (isEventAlreadyRegistered) {
      const existingEventCallbacks = this.eventCallbacks[eventName]

      for (const eventCallback of existingEventCallbacks) {
        eventCallback(event)
      }
    }
  }

  //
  // UTILITY
  //

  // FIND ITEM FUNCTION
  private static findMarkedEntityById(id: UniqueEntityID) {
    return this.markedEntityWithEvents.find((entity) => entity.id.equals(id))
  }

  // CLEAN UP FUNCTION
  private static removeEntityFromMarkedDispatchList(entity: GenericEntityType) {
    const indexFound = this.markedEntityWithEvents.findIndex((item) =>
      item.equals(entity),
    )

    // REMOVES THE ENTITY FROM THE ARRAY BASED ON INDEX
    this.markedEntityWithEvents.splice(indexFound, 1)
  }

  public static clearEventCallbacks() {
    this.eventCallbacks = {}
  }

  public static clearMarkedAggregates() {
    this.markedEntityWithEvents = []
  }
}
