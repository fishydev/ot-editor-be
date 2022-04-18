import { ConnectedUser } from "../interfaces"
import { v4 as uuidv4 } from "uuid"
import { Server, Socket } from "socket.io"
import { Server as HttpServer } from "http";
import * as fs from "fs"

export class Session {
  fileId: number
  uuid: string
  connectedUsers: ConnectedUser[]


  constructor(fileId: number, uuid: string) {
    this.fileId = fileId
    this.uuid = uuid
    this.connectedUsers = []
  }

  addUser(newUser: ConnectedUser) {
    this.connectedUsers.push(newUser)
  }

  removeUser(toRemoveUserId: number) {
    this.connectedUsers.filter(user => user.userId !== toRemoveUserId)
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
      let fileId: number
      let user = {} as ConnectedUser
      let uuid: string
      console.log("a user connected")
      socket.on('openFile', data => {
        fileId = data.fileId
        user = {
          userId: data.userId,
          username: data.username
        }
        this.onConnect(fileId, user, socket)
      })
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
        this.onDisconnect(fileId, user, socket)
      })
    })
  }

  createSession(fileId: number, uuid: string, toConnectUser: ConnectedUser) {
    let session = new Session(fileId, uuid)
    session.addUser(toConnectUser)
    this.sessionList.push(session)
  }

  destroySession(toDestroyFileId: number) {
    this.sessionList.filter(session => session.fileId !== toDestroyFileId)
  }

  onConnect(openedFileId: number, toConnectUser: ConnectedUser, socket: Socket) {
    const existingSession = this.sessionList.find(session => session.fileId === openedFileId)
    let uuid = ""

    if (existingSession) {
      existingSession.addUser(toConnectUser)
      uuid = existingSession.uuid
    } else {
      uuid = uuidv4()
      this.createSession(openedFileId, uuidv4(), toConnectUser)
    }

    socket.join(uuid)
  }

  onDisconnect(openedFileId: number, disconnectedUser: ConnectedUser, socket: Socket) {
    let session = this.sessionList.find(session => session.fileId === openedFileId)

    if (session) {
      session.removeUser(disconnectedUser.userId)
      socket.leave(session.uuid)
      if (session.connectedUsers.length < 1) {
        this.destroySession(openedFileId)
        console.log(`removed session for fileId ${openedFileId} from active sessions`)
      }
    } else {
      console.log(`session for fileId ${openedFileId} doesn't have any connected user`)
    }
  }
}