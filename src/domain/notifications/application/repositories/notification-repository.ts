import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationRepository {
  abstract create(value: Notification): Promise<void>
}
