export interface IInsertOperation {
  data: string,
  position: number,
  userId: number,
  timestamp: Date
}

export interface IDeleteOperation {
  data: string,
  position: number,
  userId: number,
  timestamp: Date
}

export interface IPendingOperations {
  operations: (IInsertOperation|IDeleteOperation)[]
}