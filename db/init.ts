import User from "../models/user.model"
const isDev = true

const dbInit = () => {
  User.sync({ alter: isDev })
}

export default dbInit