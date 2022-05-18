import { DataTypes, Model, Optional } from "sequelize"
import sequelizeConnection from "../db/config"
import { User } from './index'

interface FileAttributes {
  fileId: number;
  userId: number;
  filename: string;
  uuid: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FileInput extends Optional<FileAttributes, 'fileId'> {}
export interface FileOutput extends Required<FileAttributes> {}

class File extends Model<FileAttributes, FileInput> implements FileAttributes {
  public userId!: number
  public fileId!: number
  public filename!: string
  public uuid!: string
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
  
}

File.init({
  fileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    field: "file_id",
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id"
    },
    field: "user_id"
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "filename"
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "uuid"
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
  tableName: "files"
})

File.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

export default File