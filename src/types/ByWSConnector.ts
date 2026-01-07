import { useWebSocket } from '@vueuse/core'
import { useGameStore } from '@/stores/gameStore'
import { inGameStatus, Player } from './Player'

class ByWSConnector {
  private readonly apiUrl
  private ws: {
    data: unknown
    send: (data: string | ArrayBuffer | Blob, useBuffer?: boolean) => boolean
    status: unknown
  }
  private gameStore = useGameStore()

  constructor(url?: string) {
    if (url) {
      this.apiUrl = url
    } else {
      this.apiUrl = 'ws://localhost:8080'
    }
    this.ws = useWebSocket(this.apiUrl, {
      onMessage: (ws, event) => {
        // console.log('🚀 ~ ByWSConnector ~ constructor ~ event:', event)
        try {
          const msg = JSON.parse(event.data.toString()) as { action: string; payload?: unknown }
          this.msgRouter(msg)
        } catch (error) {
          console.log('Error', error)
        }
      },
    })
  }

  sendMsg(msg: object): boolean {
    if (this.ws.status === 'OPEN') {
      try {
        let answer: unknown
        if (this.ws?.send) {
          answer = this.ws.send(JSON.stringify(msg))
        }
        console.log('sendMessageAsync', answer)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    } else {
      return false
    }
  }

  msgRouter(msg: { action: string; payload?: unknown }) {
    // console.log('🚀 ~ ByWSConnector ~ msgRouter ~ msg:', msg.action)
    let payload
    if (msg?.payload) {
      payload = <unknown>msg.payload
    }
    if (msg?.action) {
      // console.log('🚀 ~ ByWSConnector ~ msgRouter ~ msg.action:', msg.action)
      switch (msg.action) {
        case 'added2Queue':
          payload = msg.payload as { id: string }
          this.msgActionAdded2Queue(payload.id)
          break
        case 'youingame':
          payload = msg.payload as { isPlayer: boolean }
          this.msgActionYouInGame(payload.isPlayer)
          break
        case 'youislooking':
          payload = msg.payload as { isPlayer: boolean }
          this.msgActionYouInGame(payload.isPlayer)
          break
        case 'broadcast':
          payload = msg.payload as {
            phase: string
            queueLen: number
            nGamers: number
            nLookers: number
            lastMove: string
          }
          this.msgActionBroadcast(payload)
          break
        default:
          console.log('ConnectionManager ~ sendOneMessage: No actions?!')
          break
      }
    }
  }

  msgActionAdded2Queue(id: string) {
    if (id !== '') {
      this.gameStore.player = new Player(id)
      // console.log('🚀 ~ player:', this.gameStore.player)
    }
  }

  msgActionYouInGame(isPlayer: boolean) {
    if (isPlayer) {
      this.gameStore.player.statusTo = inGameStatus.Player
    } else {
      this.gameStore.player.statusTo = inGameStatus.Looker
    }
  }

  msgActionBroadcast(payload: {
    phase: string
    queueLen: number
    nGamers: number
    nLookers: number
    lastMove: string
  }) {
    this.gameStore.game.setGameStatus({
      newPhase: payload.phase,
      newQueueLength: payload.queueLen,
      newGamers: payload.nGamers,
      newLookers: payload.nLookers,
      newMove: payload.lastMove,
    })
    this.gameStore.gameLog.push(payload.lastMove)
  }
}
export default ByWSConnector
