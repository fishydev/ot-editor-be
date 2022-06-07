import { ConnectedUser } from "../interfaces"
// import { v4 as uuidv4 } from "uuid"
import { Server, Socket } from "socket.io"
import { Server as HttpServer } from "http";
import * as fs from "fs"
import { ChangeSet, Text } from "@codemirror/state"
import { Update } from "@codemirror/collab"

export class Session {
  fileId: number
  uuid: string
  connectedUsers: ConnectedUser[]
  updates: Update[]
  doc: Text
  filePath: string
  // tempContent: string

  constructor(fileId: number, uuid: string, filePath: string) {
    this.fileId = fileId
    this.uuid = uuid
    this.filePath = filePath
    this.connectedUsers = []
    this.updates = [],
    this.doc = Text.of([""])
  }

  addUser(newUser: ConnectedUser) {
    this.connectedUsers.push(newUser)
  }

  removeUser(toRemoveUserId: number) {
    this.connectedUsers = this.connectedUsers.filter(user => user.userId != toRemoveUserId)
    console.log(`removed user ${toRemoveUserId}`)
    console.log(`connectedUsers:`)
    console.log(this.connectedUsers)
  }

  getConnectedUsers() {
    return this.connectedUsers
  }
}

export class ActiveSessions {
  sessionList: Session[]
  io: Server

  constructor(httpServer: HttpServer) {
    this.sessionList = []
    this.io = new Server(httpServer)
    this.initWebsocket()
  }

  initWebsocket() {
    this.io.on('connection', (socket: Socket) => {
      console.log(socket.handshake.query)
      let fileId: number = parseInt(socket.handshake.query.fileId as string)
      let uuid: string = socket.handshake.query.uuid as string
      let user: ConnectedUser = {
        userId: parseInt(socket.handshake.query.userId as string),
        username: socket.handshake.query.username as string
      }
      this.onUserConnected(fileId, user, socket, uuid)
      console.log("a user connected")
      let updateInterval: NodeJS.Timer

      let connectedSession = this.sessionList.find(session => session.uuid === uuid) as Session

      socket.on('getDocument', (data, callback) => {
        const username = data.username
        const filename = data.filename
        const path = `./files/${username}/${filename}.txt`

        let content = {}
        connectedSession.filePath = path

        if (connectedSession?.updates.length && connectedSession.updates.length > 0) {
          content = {
            doc: connectedSession.doc.toString(),
            version: connectedSession.updates.length
          }

          callback(content)
        } else {
          fs.readFile(path, "utf8", (err, data) => {
            if (err) throw err
            content = {
              doc: data,
              version: 0
            }
            connectedSession.doc = Text.of(data.split("\n"))
            // console.log(`getDocument res: ${content}`)
            callback(content)
          })
        }

      })

      socket.on('pullUpdates', (data, callback) => {

        updateInterval = setInterval(() => {
          if (data.version < connectedSession.updates.length) {
            let response = connectedSession.updates.slice(data.version)
            callback(response)
            clearInterval(updateInterval)
          } else {
            console.log(`no new update, delayed for 1 s`)
          }
        }, 1000)
      })

      socket.on('pushUpdates', (data, callback) => {
        console.log("doc JSON")
        console.log(connectedSession.doc.toJSON())

        if (data.version != connectedSession.updates.length) {
          callback(false)
          console.log(`update not applied: version not match`)
          console.log(`client: ${data.version}; server: ${connectedSession.updates.length}`)
        } else {
          for (let update of data.updates) {
            let changes = ChangeSet.fromJSON(update.changes)
            connectedSession.updates.push({ changes, clientID: update.clientID })
            connectedSession.doc = changes.apply(connectedSession.doc)
            console.log(`update applied`)
          }

          callback(true)
        }
      })
    
      socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.leave(connectedSession.uuid)
        this.onUserDisconnected(fileId, user)
        clearInterval(updateInterval)
      })
    })
  }

  createSession(fileId: number, uuid: string): Session {
    let session = new Session(fileId, uuid, "")
    this.sessionList.push(session)
    return session
  }

  destroySession(toDestroyFileId: number) {
    let toDestroySession = this.sessionList.find(session => session.fileId === toDestroyFileId)
    
    let data = toDestroySession?.doc.toJSON().join("\n")
    
    fs.writeFileSync(toDestroySession?.filePath as string, data as string)
    console.log(`saved file ${toDestroySession?.filePath}`)
    toDestroySession = undefined
    this.sessionList.filter(session => session.fileId !== toDestroyFileId)
    console.log(`removed session for fileId ${toDestroyFileId} from active sessions`)
    
  }

  onUserConnected(openedFileId: number, toConnectUser: ConnectedUser, socket: Socket, uuid: string) {
    const existingSession = this.sessionList.find(session => session.fileId === openedFileId)
    console.log(`toConnectUser`)
    console.log(toConnectUser)

    if (existingSession) {
      if (existingSession.connectedUsers.find(u => u.userId === toConnectUser.userId)) {
        console.log(`user ${toConnectUser.username} already connected to session`)
      } else {
        existingSession.addUser(toConnectUser)
        console.log(`joined session with uuid ${uuid}`)
        console.log(`session fileId ${existingSession.fileId} connectedUser:`)
        console.log(existingSession.connectedUsers)

      }
    } else {
      let createdSession = this.createSession(openedFileId, uuid)
      createdSession.addUser(toConnectUser)
      console.log(`creating new session with uuid ${uuid}`)
      console.log(`session fileId ${createdSession.fileId} connectedUser:`)
      console.log(createdSession.connectedUsers)
    }

    socket.join(uuid)
  }

  onUserDisconnected(openedFileId: number, disconnectedUser: ConnectedUser) {
    let session = this.sessionList.find(session => session.fileId === openedFileId)

    // let s = ""

    // console.log(session?.connectedUsers.map(user => s += `${user.username} `))

    if (session) {
      session.removeUser(disconnectedUser.userId)
      if (session.connectedUsers.length < 1) {
        this.destroySession(openedFileId)
      }
    } else {
      console.log(`session for fileId ${openedFileId} doesn't have any connected user`)
    }
  }
}