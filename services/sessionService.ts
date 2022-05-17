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
  pending: ((value: any) => void)[]
  // tempContent: string

  constructor(fileId: number, uuid: string) {
    this.fileId = fileId
    this.uuid = uuid
    this.connectedUsers = []
    this.pending = []
    this.updates = [],
    this.doc = Text.of(["Start document"])
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
        uuid = data.uuid
        user = {
          userId: data.user.userId,
          username: data.user.username
        }
        this.onUserConnected(fileId, user, socket, uuid)

        let session = this.sessionList.find(session => session.uuid === uuid)
      })

      socket.on('getDocument', (data, callback) => {
        const username = data.username
        const filename = data.filename
        const uuid = data.uuid
        const path = `./files/${username}/${filename}.txt`

        let content = {}

        let session = this.sessionList.find(session => session.uuid === uuid)

        fs.readFile(path, "utf8", (err, data) => {
          if (err) throw err
          content = {
            doc: data,
            version: session?.updates.length
          }
          console.log(`getDocument res: ${content}`)
          callback(content)
        })


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
        this.onUserDisconnected(fileId, user, socket)
      })
    })
  }

  createSession(fileId: number, uuid: string): Session {
    let session = new Session(fileId, uuid)
    this.sessionList.push(session)
    return session
  }

  destroySession(toDestroyFileId: number) {
    this.sessionList.filter(session => session.fileId !== toDestroyFileId)
  }

  onUserConnected(openedFileId: number, toConnectUser: ConnectedUser, socket: Socket, uuid: string) {
    const existingSession = this.sessionList.find(session => session.fileId === openedFileId)

    if (existingSession) {
      existingSession.addUser(toConnectUser)
      console.log(`joined session with uuid ${uuid}`)
      console.log(`session fileId ${existingSession.fileId} connectedUser:`)
      console.log(existingSession.connectedUsers)
    } else {
      let createdSession = this.createSession(openedFileId, uuid)
      createdSession.addUser(toConnectUser)
      console.log(`creating new session with uuid ${uuid}`)
      console.log(`session fileId ${createdSession.fileId} connectedUser:`)
      console.log(createdSession.connectedUsers)
    }

    socket.join(uuid)
  }

  onUserDisconnected(openedFileId: number, disconnectedUser: ConnectedUser, socket: Socket) {
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