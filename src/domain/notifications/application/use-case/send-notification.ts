import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Right } from '@/core/errors/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'

export type SendNotificationRequest = {
  title: string
  content: string
  recipientId: string
}
export type SendNotificationResponse = Either<null, unknown>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async handle({
    title,
    content,
    recipientId,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    await this.notificationRepository.create(notification)

    return Right.create(null)
  }
}
