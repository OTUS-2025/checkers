import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import ByHTTPConnector from '@/types/ByHTTPConnector'
import ByWSConnector from '@/types/ByWSConnector'
import { Player } from '@/types/Player'
import gameState from '@/types/gameState'

export const useGameStore = defineStore('game', () => {
  const serverIsActive = ref(false)
  const serverLog = reactive({ all: [] })
  const game = reactive(new gameState())
  const gameLog = ref([''])
  const player = reactive<Player>({} as Player)

  const linkByHTTP = new ByHTTPConnector()
  const linkByWS = new ByWSConnector()

  async function init() {
    serverIsActive.value = await linkByHTTP.getServerStatus()
  }

  return { linkByHTTP, linkByWS, serverIsActive, serverLog, game, gameLog, init, player }
})
