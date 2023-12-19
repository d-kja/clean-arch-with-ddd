import { makeNotification } from 'tests/factories/make-notification.factory'
import { InMemoryNotificationRepository } from 'tests/in-memory/notification-in-memory-repository'
import { ReadNotificationUseCase } from './read-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('@use-cases/send-notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(notificationRepository)
  })

  it('should be able to create a new notification', async () => {
    const notification = makeNotification()
    await notificationRepository.create(notification)

    const result = await sut.handle({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0]).toEqual(
      expect.objectContaining({
        readAt: expect.any(Date),
      }),
    )
  })
})
