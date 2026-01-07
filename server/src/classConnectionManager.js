import { v4 as uuidv4, NIL as NIL_UUID } from 'uuid'

class gameState {
  availabelPhases = ['wait for players', 'wait for one player', 'ready for start', 'go']
  MAX_PLAYERS = 2
  phase = undefined
  queue = []
  players = undefined
  movesLog = []
  // TODO: describe data structure for checkers position

  constructor() {
    this.phase = 'wait for players'
    this.queue = []
    this.players = new Map()
    this.players.set('first', NIL_UUID)
    this.players.set('second', NIL_UUID)
  }

  connect2Game(id) {
    let result = false
    if (this.nGamers <= this.MAX_PLAYERS) {
      switch (this.nGamers) {
        case 1:
          this.players.set('first', id)
          this.phase = 'wait for one player'
          break
        case 2:
          this.players.set('second', id)
          this.phase = 'ready for start'
          break
        default:
          break
      }
      result = true
    }
    return result
  }

  get nGamers() {
    return this.queue.filter((item) => item.isActive).length
  }

  get nLookers() {
    return this.queue.length - this.nGamers
  }

  get lastMove() {
    if (this.movesLog.length === 0) {
      return false
    }
    return this.movesLog[this.movesLog.length - 1]
  }

  get state() {
    return {
      phase: this.phase,
      queueLen: this.queue.length,
      nGamers: this.nGamers,
      nLookers: this.nLookers,
      lastMove: this.lastMove,
    }
  }

  get queueLen() {
    return this.queue.length
  }

  get isReady() {
    let answer = false
    if (this.phase === 'ready for start') {
      answer = true
    }
    return answer
  }

  set phaseUpdate(value) {
    if (this.availabelPhases.includes(value)) {
      this.phase = value
    }
  }
}

class ConnectionManager {
  game = new gameState()
  log = []
  constructor() {
    // this.game = new gameState()
    this.clients = new Set()
    this.add2Log('Lets go agayn!')
  }

  addClient(ws) {
    this.clients.add(ws)
    // console.log('🚀 ~ ConnectionManager ~ addClient ~ this.clients:', this.clients)
    this.add2Log(`Client added. Total clients: ${this.clients.size}`)
  }

  removeClient(ws) {
    this.clients.delete(ws)
    this.add2Log(`Client removed. Total clients: ${this.clients.size}`)
  }

  sendOneMessage(ws, msg) {
    // console.log('🚀 ~ ConnectionManager ~ sendOneMessage ~ msg:', msg)
    if (typeof msg === 'object') {
      msg = JSON.stringify(msg)
    }
    this.add2Log(msg)
    ws.send(msg.toString())
  }

  broadcast(message, sender = null) {
    console.log('🚀 ~ ConnectionManager ~ broadcast ~ message:', message)
    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === client.OPEN) {
        try {
          if (typeof message === 'object') {
            message = JSON.stringify(message)
          }
          client.send(message)
        } catch (error) {
          console.error('Error broadcasting to client:', error)
          this.removeClient(client)
        }
      }
    })
  }

  get nClient() {
    return this.clients.size
  }

  get stateGame() {
    return this.game.state
  }

  get logAll() {
    return this.log
  }

  add2Log(msg, level = 'system') {
    // console.log('🚀 ~ ConnectionManager ~ add2Log ~ msg:', msg)
    this.log.push({ time: Date.now(), level: level, message: msg })
    // console.log(msg)
  }

  messageRouter(ws, resivedData) {
    let payload = {}
    let answerAction = ''
    const msg = JSON.parse(resivedData)
    if (msg?.action) {
      switch (msg.action) {
        case 'add2queue':
          payload = { id: this.msgActionAdd2Queue(msg.name) }
          answerAction = 'added2Queue'
          break
        case 'iwantplay':
          payload = this.msgActionIwantplay(msg.payload.playerId)
          answerAction = 'youingame'
          break
        case 'iwantlook':
          payload = this.msgActionIwantLook(msg.payload.playerId)
          answerAction = 'youislooking'
          break
        default:
          break
      }
      this.sendOneMessage(ws, { action: answerAction, payload: payload })
      this.broadcast({ action: 'broadcast', payload: this.game.state })
    }
  }

  msgActionAdd2Queue(name) {
    const playerId = uuidv4()
    this.game.queue.push({ id: playerId, isActive: false, name: name })
    return playerId
  }

  msgActionIwantplay(id) {
    let answer = { isActive: false }
    const queueNdx = this.game.queue.findIndex((player) => player.id === id)
    if (queueNdx > -1) {
      this.game.queue[queueNdx].isActive = true
      if (!this.game.isReady) {
        this.game.connect2Game(id)
      }
      answer = { isActive: true }
    }
    return answer
  }

  msgActionIwantLook(id) {
    let answer = { isLooking: false }
    const queueNdx = this.game.queue.findIndex((player) => player.id === id)
    if (queueNdx > -1) {
      this.game.queue[queueNdx].isActive = false
      answer = { isLooking: true }
    }
    return answer
  }

  newConnection(ws, request) {
    const clientIP = request.socket.remoteAddress
    console.log(`New client connected from ${clientIP}`)

    this.addClient(ws)
    this.sendOneMessage(ws, {
      action: 'welcome',
      payload: { text: `Welcome! There are ${this.nClient} clients connected.` },
    })
    // Notify other clients about new connection
    this.broadcast(
      {
        action: 'welcome',
        payload: { text: `A new player joined the game!` },
      },
      ws,
    )
  }
}
export default new ConnectionManager()
