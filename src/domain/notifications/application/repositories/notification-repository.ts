import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationRepository {
  abstract create(value: Notification): Promise<void>
  abstract save(value: Notification): Promise<void>
  abstract findById(value: string): Promise<Notification | null>
}
