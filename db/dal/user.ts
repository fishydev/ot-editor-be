import { Op } from "sequelize"
import User, { UserInput, UserOutput } from "../../models/user.model"

export const create = async(payload: UserInput): Promise<UserOutput> => {
  const user = await User.create(payload)
  return user
}

export const update = async (id: number, payload: Partial<UserInput>): Promise<UserOutput> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new Error('User not found')
  }
  const updatedUser = await (user as User).update(payload)
  return updatedUser
}

export const getById = async (id: number): Promise<UserOutput> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new Error("User not found")
  }
  return user
}

export const getByUsername = async (username: string): Promise<UserOutput> => {
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  if (!user) {
    throw new Error ("Username not found")
  }
  return user
}

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedUserCount = await User.destroy({
    where: {
      userId: id
    }
  })
  return !!deletedUserCount
}

export const checkDuplicateUsername = async (username: string): Promise<boolean> => {
  const duplicateUsername = await User.findOne({
    where: {
      username: username
    }
  })
  return !!duplicateUsername
}

export const checkDuplicateEmail = async (email: string): Promise<boolean> => {
  const duplicateEmail = await User.findOne({
    where: {
      email: email
    }
  })
  return !!duplicateEmail
}