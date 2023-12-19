import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { NotificationRepository } from '../repositories/notification-repository'

export type ReadNotificationRequest = {
  recipientId: string
  notificationId: string
}
export type ReadNotificationResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  unknown
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async handle({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return Left.create(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return Left.create(new UnauthorizedError())
    }

    notification.read()
    await this.notificationRepository.save(notification)

    return Right.create(null)
  }
}
