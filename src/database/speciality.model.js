import sequelize from "./db_config.js"
import { DataTypes } from "sequelize"
import doctorModel from "./doctor.model.js"
import patientModel from "./patient.model.js"

const specialityModel = sequelize.define("speciality", {
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

export default specialityModel