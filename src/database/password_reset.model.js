import sequelize from "./db_config.js"
import { DataTypes } from "sequelize"
import doctorModel from "./doctor.model.js"
import patientModel from "./patient.model.js"

const passwordResetModel = sequelize.define("password_reset", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    secret: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

// passwordResetModel.hasOne(doctorModel)
// passwordResetModel.hasOne(patientModel)

// doctorModel.belongsTo(passwordResetModel)
// patientModel.belongsTo(passwordResetModel)

// TODO: How does sequelize know to refer to correct ids in other table?
passwordResetModel.belongsTo(doctorModel)
passwordResetModel.belongsTo(patientModel)

export default passwordResetModel