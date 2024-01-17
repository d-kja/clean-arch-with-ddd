import { SpyInstance } from "vitest"
import { AggregateRoot } from "../entities/aggregate-root"
import { UniqueEntityID } from "../entities/value-object/unique-entity-id"
import { DomainEvent } from "./domain-event"
import { DomainEvents } from "./domain-events"

class GenericClass extends AggregateRoot<unknown> {
	addEvent(domainEvent: DomainEvent) {
		this.addDomainEvent(domainEvent)
	}

	static create() {
		return new GenericClass(null)
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const eventCallback: any = vi.fn((event) =>
	console.log("I've been called", { event }),
)

describe("@core/domain-events", async () => {
	it("should be able to create and publish an event", async () => {
		const event: DomainEvent = {
			ocurredAt: new Date(),
			getId: () => new UniqueEntityID("fake-id"),
		}

		// registering the subscriber/listener
		DomainEvents.register(eventCallback, "Object")

		// push event to queue
		const genericClass = GenericClass.create()
		genericClass.addEvent(event)

		expect(genericClass.domainEvents).toHaveLength(1)

		// publish event / persist data
		DomainEvents.dispatchEventsForEntity(genericClass.id)

		expect(genericClass.domainEvents).toHaveLength(0)
		expect(eventCallback).toHaveBeenCalledOnce()
	})
})
