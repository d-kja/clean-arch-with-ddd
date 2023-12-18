import { InMemoryNotificationRepository } from 'tests/in-memory/notification-in-memory-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('@use-cases/send-notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('should be able to create a new notification', async () => {
    const result = await sut.handle({
      title: 'example',
      content: 'example',
      recipientId: 'id',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items).toHaveLength(1)
    expect(notificationRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'example',
      }),
    )
  })
})
