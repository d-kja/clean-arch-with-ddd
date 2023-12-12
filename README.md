# Clean Architecture with DDD

A Forum application using both Clean Arch, DDD, and Unit testing

## Aggregate root

It's basically an object that manages more than one entity, it has kind of a main entity but that entity has side effects that needs to be managed within that context, and specifically for that reason that aggregates are used.

Let's say I have a Question entity created and someone answers that question, we need to dispatch (pub/sub) a notification for the creator of that question so that he knows that someone answered their question, right?

But when do we create the Notification entity? Possibly a reasonable answer would be after creating the answer... and just publish that notification once the answer is persisted.

So the Answer entity needs to have a way to create those notifications after creating it's entity.

Aggregate root.

(when specific entities needs to work together to finish the job)

## Watched lists

Basically a list that watches the old, current, and the new values for a certain "list", so that managing/persisting those changes aren't as much of a trouble as it would be if we weren't using watched lists... duh 🙂

## Publish/subscribe (pub/sub)

What we did was pretty much use a callback handler to execute a certain functionality when the Entity was finally persisted in the database. So we basically create a class that manages a list in a static/global manner and once everything is done it calls the callback to notify the creator of the question
