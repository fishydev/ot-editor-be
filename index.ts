import * as express from 'express';
import * as http from "http";
import * as cors from "cors"
import * as fs from "fs"
import { Server, Socket } from "socket.io"
import * as bodyParser from "body-parser"
import { ActiveSession, ActiveSessions } from './services/sessionService'; 
import { v4 as uuid } from "uuid"

import routes from "./routes"

const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.send("Hello World")
})

const server = http.createServer(app)
const io = new Server(server)

const port = process.env.port || 8999

const sessionTracker = new ActiveSessions()

// Socket.io
io.on('connection', (socket: Socket) => {
  console.log("a user connected")
  socket.on('syncReq', data => {
    const filename = data.filename
    const username = data.username
    const firstLoad = data.firstLoad
    const path = `./files/${username}/${filename}`
    // console.log(data)
    console.log(`syncReq ${username}/${filename}`)
    console.log(`content: ${data.content}`)
    try {
      if (!firstLoad) {
        fs.writeFileSync(`${path}.txt`, data.content)
      }
    } catch (err) {
      console.log(err)
    } finally {
      fs.readFile(`${path}.txt`, "utf8", (err, data) => {
        if (err) throw err
        console.log(`data: ${data}`)
  
        socket.emit("syncRes", data)
      })
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
})