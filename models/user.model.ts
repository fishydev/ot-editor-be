import { DataTypes, Model, Optional } from "sequelize"
import sequelizeConnection from "../db/config"

interface UserAttributes {
  userId: number;
  email: string;
  username: string;
  password: string;
  // status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'userId'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public userId!: number
  public email!: string
  public username!: string
  public password!: string
  // public status!: string
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  
}

User.init({
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "user_id"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: "created_at"
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: "updated_at"
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: "deleted_at"
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true,
  tableName: "users"
})

export default User