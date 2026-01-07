import { v4 as uuidv4, NIL as NIL_UUID } from 'uuid'

export enum inGameStatus {
  Waiter = 0,
  Player = 1,
  Looker = 2,
}

export class Player {
  private status: inGameStatus
  public readonly id: string

  constructor(id: string) {
    if (id !== '') {
      this.id = id
    } else {
      this.id = uuidv4()
    }
    this.status = inGameStatus.Waiter
  }

  get idIs() {
    if (this.id !== '') {
      return this.id
    } else {
      return NIL_UUID
    }
  }

  set statusTo(status4set: inGameStatus) {
    this.status = status4set
  }
}
