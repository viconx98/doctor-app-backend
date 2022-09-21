import dotenv from "dotenv"
dotenv.config()

import { Sequelize,  DataTypes } from "sequelize"

const sequelize = new Sequelize(process.env.DB_URI)


export default sequelize