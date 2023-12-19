import { NotificationRepository } from '@/domain/notifications/application/repositories/notification-repository'
import { Notification } from '@/domain/notifications/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = []

  async save(value: Notification): Promise<void> {
    const indexFound = this.items.findIndex(
      (item) => item.id.toString() === value.id.toString(),
    )

    this.items[indexFound] = value
  }

  async create(value: Notification): Promise<void> {
    this.items.push(value)
  }

  async findById(value: string): Promise<Notification | null> {
    const result = this.items.find((item) => item.id.toString() === value)

    if (!result) return null

    return result
  }
}
