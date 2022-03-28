export interface User {
  userId: number;
  email: string;
  username: string;
  password: string;
  // status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}