import { ConnectedUser } from "../interfaces"
import { v4 as uuidv4 } from "uuid"

export class ActiveSession {
  fileId: number
  uuid: string
  connectedUsers: ConnectedUser[]

  constructor(fileId: number, uuid: string) {
    this.fileId = fileId,
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
  sessionList: ActiveSession[]

  constructor() {
    this.sessionList = []
  }

  createSession(fileId: number, uuid: string) {
    let session = new ActiveSession(fileId, uuid)

    this.sessionList.push(session)
  }

  destroySession(toDestroyUuid: string) {
    this.sessionList.filter(session => session.uuid !== toDestroyUuid)
  }

  onConnect(openedFileId: number, toConnectUser: ConnectedUser) {
    const existingSession = this.sessionList.find(session => session.fileId === openedFileId)

    if (existingSession) {
      existingSession.addUser(toConnectUser)
    } else {
      const newSession = new ActiveSession(openedFileId, uuidv4())
      newSession.addUser(toConnectUser)
      this.sessionList.push(newSession)
    }
  }

  onDisconnect(openedFileId: number, disconnectedUser: ConnectedUser) {
    let session = this.sessionList.find(session => session.fileId === openedFileId)

    if (session) {
      session.removeUser(disconnectedUser.userId)
      if (session.connectedUsers.length < 1) {
        this.sessionList.filter(session => session.fileId !== openedFileId)
        console.log(`removed session for fileId ${openedFileId} from active sessions`)
        session = undefined
      }
    } else {
      console.log(`session for fileId ${openedFileId} doesn't have any connected user`)
    }
  }
}