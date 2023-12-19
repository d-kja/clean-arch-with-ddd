import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notifications/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  props?: Partial<NotificationProps>,
  id?: UniqueEntityID,
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.text(),
      content: faker.lorem.text(),
      ...props,
    },
    id,
  )
}
