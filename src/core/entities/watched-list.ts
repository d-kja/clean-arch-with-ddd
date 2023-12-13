export abstract class WatchedList<T> {
  private initialItems: T[] // Initial value
  public currentItems: T[] // Current values

  private newItems: T[] // Items that have been updated since the creation of this instance
  private removedItems: T[] // Items that have been updated since the creation of this instance

  constructor(initialItems?: T[]) {
    this.initialItems = initialItems || []
    this.currentItems = initialItems || []

    // Only updates when changes occur
    this.newItems = []
    this.removedItems = []
  }

  // Compare both instances of the same Type (maybe through IDs) and returns a boolean
  // Abstract because each Entity that extends this Class has its own way of implementing this
  abstract compareItems(itemA: T, itemB: T): boolean

  /**
   * GETTERS
   */

  public getCurrentItems(): T[] {
    return this.currentItems
  }

  public getNewItems(): T[] {
    return this.newItems
  }

  public getRemovedItems(): T[] {
    return this.removedItems
  }

  /**
   * METHODS TO COMPARE ITEMS
   */

  private isNewItem(itemToCompare: T): boolean {
    return (
      this.newItems.filter((newItem: T) =>
        this.compareItems(itemToCompare, newItem),
      ).length !== 0
    )
  }

  private isRemovedItem(itemToCompare: T): boolean {
    return (
      this.removedItems.filter((removedItem: T) =>
        this.compareItems(itemToCompare, removedItem),
      ).length !== 0
    )
  }

  private isCurrentItem(itemToCompare: T): boolean {
    return (
      this.currentItems.filter((currentItem: T) =>
        this.compareItems(itemToCompare, currentItem),
      ).length !== 0
    )
  }

  private wasAddedInitially(itemToCompare: T): boolean {
    return (
      this.initialItems.filter((item: T) =>
        this.compareItems(itemToCompare, item),
      ).length !== 0
    )
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  /**
   * METHODS TO REMOVE ITEMS
   */

  private removeFromNewItems(itemToCompare: T): void {
    this.newItems = this.newItems.filter(
      (item) => !this.compareItems(item, itemToCompare),
    )
  }

  private removeFromRemovedItems(itemToCompare: T): void {
    this.removedItems = this.removedItems.filter(
      (item) => !this.compareItems(itemToCompare, item),
    )
  }

  private removeFromCurrentItems(itemToCompare: T): void {
    this.currentItems = this.currentItems.filter(
      (item) => !this.compareItems(itemToCompare, item),
    )
  }

  /**
   * METHODS TO MANIPULATE THE ARRAYS
   */

  public add(item: T): void {
    // IF IT WAS REMOVED AND ADDED AGAIN, REMOVE FROM THE REMOVED ARRAY, OLD ONE
    if (this.isRemovedItem(item)) {
      this.removeFromRemovedItems(item)
    }

    // NOT A NEW ONE AND WASN'T IN THE ARRAY WHEN THE CLASS WAS INSTANTIATED, SO ITS A NEW ONE
    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.newItems.push(item)
    }

    // NOT IN THE CURRENT ITEMS, THEN PUSH (RETAINS THE UPDATED VERSION OF THE ITEMS)
    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item)
    }
  }

  public remove(item: T): void {
    // REMOVE FROM CURRENT ITEMS ARRAY
    this.removeFromCurrentItems(item)

    // IF IT WAS A NEW ITEM, REMOVE FROM THE NEW ARRAY
    if (this.isNewItem(item)) {
      this.removeFromNewItems(item)

      // AS IT'S A NEW ONE WE DON'T NEED TO KEEP TRACK OF IT ON THE REMOVED ITEMS ARRAY, WE JUST KEEP TRACK OF THE REMOVED FROM THE INITIAL VALUES TO MAKE SURE THAT WE CAN PERSIST THOSE ITEMS PROPERLY
      return
    }

    // IF IT WASN'T IN THE REMOVED ITEMS, UPDATE THE ARRAY TO KEEP TRACK OF THE CHANGES
    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item)
    }
  }

  public update(items: T[]): void {
    // CHECKING IF THE ITEMS THAT WE SENT CONTAINS AN ITEM THAT HASN'T BEEN LISTED IN THE CURRENT ITEMS ARRAY
    const newItems = items.filter((firstItem) => {
      return !this.getCurrentItems().some((secondItem) =>
        this.compareItems(firstItem, secondItem),
      )
    })

    // CHECKING IF THE ITEMS IN THE CURRENT ARRAY ARE CONTAINED INSIDE THE ITEMS THAT WE SENT, IF NOT THEN IT HAS BEEN REMOVED FROM THE ARRAY
    const removedItems = this.getCurrentItems().filter((firstItem) => {
      return !items.some((secondItem) =>
        this.compareItems(firstItem, secondItem),
      )
    })

    // UPDATING THE EXITING VALUES ACCORDING TO THE FILTERED ONES
    this.currentItems = items
    this.newItems = newItems
    this.removedItems = removedItems
  }
}
