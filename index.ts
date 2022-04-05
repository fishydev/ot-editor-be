import * as express from 'express';
import * as http from "http";
import * as cors from "cors"
import * as fs from "fs"
import { Server, Socket } from "socket.io"
import * as bodyParser from "body-parser"

import routes from "./routes"

import FileRouter from "./routes/file.routes"


const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// app.use("/api/files", FileRouter)
app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.send("Hello World")
})

const server = http.createServer(app)
const io = new Server(server)

const port = process.env.port || 8999

// const wss = new WebSocket.Server({ server })

// Socket.io
io.on('connection', (socket: Socket) => {
  console.log("a user connected")

  // socket.on('syncReq', (id) => {
  //   console.log(`syncReq ${id}`)
  // })
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

  socket.on('chat message', (msg) => {
    console.log(msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// WS
// interface ExtWebSocket extends WebSocket {
//   isAlive: Boolean;
// }

// wss.on('connection', (ws: WebSocket) => {
//   const extWs = ws as ExtWebSocket;
//   extWs.isAlive = true;

//   ws.on('pong', () => {
//     extWs.isAlive = true;
//   })

//   ws.on('message', (data: string) => {

//     let file = {} as FileModel

//     try {
//       file = JSON.parse(data) as FileModel
//     } catch (e) {
//       ws.send("failed to parse data")
//       ws.close()
//     }

//     let fileId = file.id
//     let path = `./files/${fileId}.txt`
//     console.log(`action: ${file.action}`)
//     console.log(`id: ${file.id}`)

//     switch (file.action) {
//       case "read":
//         try {
//           fs.readFile(path, (err, data) => {
//             if (err) throw err
      
//             return ws.send(data)
//           })
//         } catch (err) {
//           ws.send(`file not found, closing connection`)
//           ws.close()
//         }
//         break;
//       case "update":
//         fs.writeFile(`${path}.txt`, file.content, () => {
//           ws.send("failed to update file")
//         })
//         break;
//       default:
//         ws.send("bad data")
//         break;
//     }

    // if (file.action === 'get') {
    //   try {
    //     fs.readFile(path, (err, data) => {
    //       if (err) throw err
    
    //       return ws.send(data)
    //     })
    //   } catch (err) {
    //     ws.send(`file not found, closing connection`)
    //     ws.close()
    //   }
    // }
  // })

  // ws.on('update', (payload: string) => {
  //   let file = JSON.parse(payload) as FileModel
  //   let fileId = file.id
  //   let path = `./files/${fileId}.txt`
    
  //   try {
  //     if (fs.existsSync(path)) {
  //       next()
  //     } else {
  //       throw new Error(`${path} not found`)
  //     }
  //   } catch (err) {
  //     console.log(err)
  //     res.status(404).send("file not found")
  //   }
  // })

  // ws.send(`Hi there, I am a websocket server`);
// })

// setInterval(() => {
//   wss.clients.forEach((ws: WebSocket) => {
//     const extWs = ws as ExtWebSocket;

//     if (!extWs.isAlive) return ws.terminate();
//     extWs.isAlive = false;
//     ws.ping(null, undefined)
//   })
// }, 5000)

server.listen(port, () => {
  console.log(`Server started on port ${port} :)`);
})