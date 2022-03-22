export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  // status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}