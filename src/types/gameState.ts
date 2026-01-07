enum gamesPhase {
  waitAll = 'wait for players',
  waitOne = 'wait for one player',
  readyForStart = 'ready for start',
  go = 'go',
}

class gameState {
  private phase: gamesPhase
  private queueLen: number
  private nGamers: number
  private nLookers: number
  private lastMove: string

  constructor() {
    this.phase = gamesPhase.waitAll
    this.queueLen = 0
    this.nGamers = 0
    this.nLookers = 0
    this.lastMove = ''
  }

  setGameStatus(value: {
    newPhase?: string
    newQueueLength?: number
    newGamers?: number
    newLookers?: number
    newMove?: string
  }) {
    if (value.newGamers !== undefined) {
      this.nGamers = value.newGamers
    }
    if (value.newLookers !== undefined) {
      this.nLookers = value.newLookers
    }
    if (value.newQueueLength !== undefined) {
      this.queueLen = value.newQueueLength
    }
    if (value.newPhase !== undefined && value.newPhase.length > 0) {
      try {
        this.phase = value.newPhase as gamesPhase
      } catch (error) {
        console.log('🚀 ~ gameState ~ setGameStatus ~ error:', error)
      }
    }
    if (value.newMove !== undefined && value.newMove.length > 0) {
      this.lastMove = value.newMove
    }
  }

  get move(): string {
    return this.lastMove
  }

  get actualPhase() {
    let returnValue = gamesPhase.waitAll
    switch (this.phase) {
      case gamesPhase.go:
        returnValue = gamesPhase.go
        break
      case gamesPhase.waitAll:
        break
      case gamesPhase.waitOne:
        returnValue = gamesPhase.waitOne
        break
      case gamesPhase.readyForStart:
        returnValue = gamesPhase.readyForStart
    }
    return returnValue
  }
}
export default gameState
