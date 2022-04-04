export interface Auth {
  username: string;
  userId?: number
  password?: string;
  token: string
}

export interface TokenPayload {
  userId: number,
  username: string,
  iat: number,
  exp: number
}