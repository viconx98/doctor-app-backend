import sequelize from "./db_config.js"
import { DataTypes } from "sequelize"
import doctorModel from "./doctor.model.js"
import patientModel from "./patient.model.js"

const appointmentModel = sequelize.define("appointment", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending"
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    prescriptions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
})

await appointmentModel.sync({force: true})
export default appointmentModel