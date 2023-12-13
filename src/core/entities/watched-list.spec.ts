import { WatchedList } from './watched-list'

class GenericWatchedList<T> extends WatchedList<T> {
  compareItems(itemsA: T, itemsB: T): boolean {
    return itemsA === itemsB
  }
}

describe('@entities/watched-list', () => {
  it('should be to create a watched list', () => {
    const numberList = new GenericWatchedList<number>([1, 2, 3])

    expect(numberList.currentItems).toHaveLength(3)
    expect(numberList.currentItems).toEqual([1, 2, 3])
  })

  it('should be to watch the changes', () => {
    const numberList = new GenericWatchedList<number>([1, 2, 3])

    numberList.add(4)
    numberList.add(5)

    numberList.remove(1)
    numberList.remove(3)

    expect(numberList.currentItems).toHaveLength(3)

    expect(numberList.currentItems).toEqual([2, 4, 5])
    expect(numberList.getNewItems()).toEqual([4, 5])
    expect(numberList.getRemovedItems()).toEqual([1, 3])
  })

  it('should be to maintain the item as a current one if it was removed and added again', () => {
    const numberList = new GenericWatchedList<number>([1, 2, 3])

    numberList.remove(1)

    numberList.add(4)
    numberList.add(1)

    expect(numberList.currentItems).toHaveLength(4)

    expect(numberList.currentItems).toEqual([2, 3, 4, 1])
    expect(numberList.getNewItems()).toEqual([4])
    expect(numberList.getRemovedItems()).toHaveLength(0)
  })

  it('should be to remove the item from the state if it was added and then removed right after', () => {
    const numberList = new GenericWatchedList<number>([1, 2, 3])

    numberList.add(4)
    numberList.remove(4)

    expect(numberList.currentItems).toHaveLength(3)

    expect(numberList.currentItems).toEqual([1, 2, 3])
    expect(numberList.getNewItems()).toHaveLength(0)
    expect(numberList.getRemovedItems()).toHaveLength(0)
  })

  it('should be to update the whole state when needed', () => {
    const numberList = new GenericWatchedList<number>([1, 2, 3])

    numberList.update([2, 3, 4, 5]) // '1' was removed and '4' and '5' added
    numberList.remove(5) // '5' was marked as a new item but then suddenly removed, therefore we should have no reference for this dood

    expect(numberList.currentItems).toHaveLength(3)
    expect(numberList.currentItems).toEqual([2, 3, 4])

    expect(numberList.getNewItems()).toHaveLength(1)
    expect(numberList.getNewItems()).toEqual([4])

    expect(numberList.getRemovedItems()).toHaveLength(1)
    expect(numberList.getRemovedItems()).toEqual([1]) // only '1' cuz 5 was a new one, not a initial value
  })
})
