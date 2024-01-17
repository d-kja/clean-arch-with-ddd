import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id"

type CallbackFn = (value: unknown) => void
type EventCallback = Record<string, CallbackFn[]>

abstract class Event {
	abstract ocurredAt: Date
	abstract getId(): UniqueEntityID
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Events {
	static eventsCallback: EventCallback = {}
	static entitiesWithEvents: AggregateRoot<unknown>[] = []

	/**
	 * CORE
	 */

	// SUB (CREATE NEW LISTENERS)
	static createSubscriber(eventName: string, eventCallback: CallbackFn) {
		const isEventAlreadyCreated = eventName in this.eventsCallback
		if (!isEventAlreadyCreated) this.eventsCallback[eventName] = []

		this.eventsCallback[eventName].push(eventCallback)
	}

	// PUB (PUBLISH EVENTS -> RUN THE CALLBACKS)
	static publishEvents(event: Event) {
		const eventName = event.constructor.name
		const isEventRegistered = eventName in this.eventsCallback

		if (isEventRegistered) {
			const eventCallbacks = this.eventsCallback[eventName]

			for (const callback of eventCallbacks) {
				callback(event)
			}
		}
	}

	// DATABASE ONLY (AFTER PERSISTENCE OCURRED)
	static publishEntityEventsById(id: UniqueEntityID) {
		const entity = this.findEntityById(id)

		if (entity) {
			entity.domainEvents.forEach((event) => this.publishEvents(event))
		}
	}

	/**
	 * UTILITY
	 */

	static findEntityById(id: UniqueEntityID) {
		return this.entitiesWithEvents.find((entity) => entity.id.equals(id))
	}

	// PUSH ENTITY CONTAINING EVENTS TO THE WAITING LIST, KINDA
	static markEntityWithEvents(entity: AggregateRoot<unknown>) {
		const isEntityAlreadyMarked = !!this.findEntityById(entity.id)

		if (!isEntityAlreadyMarked) {
			this.entitiesWithEvents.push(entity)
		}
	}
}
