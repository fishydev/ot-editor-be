import { Update } from "@codemirror/collab"
import { Server, Socket } from "socket.io"
import { Server as HttpServer } from "http";
import { ChangeSet, Text } from "@codemirror/state";

export class CollabSession {
  updates: Update[]
  userList: string[]
  doc: Text
  io: Server

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer)
    this.updates = []
    this.userList = []
    this.doc = Text.of(["from server"])
    this.initWebsocket()
  }

  initWebsocket() {
    this.io.on('connection', (socket: Socket) => {
      this.userList.push(socket.handshake.query.username as string)
      let updateInterval: NodeJS.Timer

      console.log(`a user connected`)

      socket.on('getDocument', (data, callback) => {
        let content = {
          doc: this.doc,
          version: this.updates.length
        }

        callback(content)
      })

      socket.on('pullUpdates', (data, callback) => {
        updateInterval = setInterval(() => {
          if (data.version < this.updates.length) {
            callback(this.updates.slice(data.version))
            clearInterval(updateInterval)
            console.log(`pullUpdates res sent`)
          } else {
            console.log(`no new update, delayed for 1 s`)
          }
        }, 5000)
      })

      socket.on('pushUpdates', (data, callback) => {
        console.log(`pushUpdates req received`)
        if (data.version != this.updates.length) {
          console.log(`version mismatch > client: ${data.version} server: ${this.updates.length}`)
          callback(false)
        } else {
          for (let update of data.updates) {
            let changes = ChangeSet.fromJSON(update.changes)
            this.updates.push({changes, clientID: update.clientID})
            this.doc = changes.apply(this.doc)
            console.log(`update applied`)
          }
          callback(true)
        }
      })

      socket.on(`getDocument`, (data, callback) => {
        callback({
          doc: this.doc,
          version: this.updates.length
        })
      })

      socket.on(`disconnect`, () => {
        console.log(`user disconnected`)
        clearInterval(updateInterval)
      })
    })
  }
}