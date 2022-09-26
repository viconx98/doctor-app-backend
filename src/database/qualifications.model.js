import sequelize from "./db_config.js"
import { DataTypes } from "sequelize"
import { qualifications } from "../validations/constants.js"

const qualificationsModel = sequelize.define("qualification", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})



export default qualificationsModel