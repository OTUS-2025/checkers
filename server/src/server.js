import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import ConnectionManager from './classConnectionManager'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server, clientTracking: true })
const PORT = 8080
const cManager = ConnectionManager

// express app setup
app
  .use(cors())
  .use(express.json())
  .get('/', (req, res) => res.send('NetChekers server ok!'))
  .get('/status', (req, res) => res.send({ status: true }))
  .get('/state', (req, res) => {
    res.send(cManager.stateGame)
  })
  .get('/log', (req, res) => res.send(cManager.logAll))

// wss setup
wss.on('connection', (ws, request) => {
  cManager.newConnection(ws, request)

  ws.on('message', (data) => {
    try {
      const messageText = data.toString()
      // console.log('Received:', messageText)
      cManager.messageRouter(ws, messageText)

      // Broadcast message to all other clients
      // cManager.broadcast(`Player says: ${messageText}`, ws)
    } catch (error) {
      console.error('Error processing message:', error)
    }
  })

  ws.on('close', (code, reason) => {
    cManager.removeClient(ws)
    cManager.broadcast(`A player disconnected the game!`, ws)
    console.log(`Client disconnected - Code: ${code}, Reason: ${reason}`)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`WebSocket server on ws://localhost:${PORT}`)
})
