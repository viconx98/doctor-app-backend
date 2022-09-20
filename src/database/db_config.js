import dotenv from "dotenv"
dotenv.config()

import { Sequelize,  DataTypes } from "sequelize"

const sequelize = new Sequelize(process.env.DB_URI)

// Create doctor table
export const doctorModel = sequelize.define("doctor", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    setupComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

// Create patient table
export const patientModel = sequelize.define("patient", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    setupComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export default sequelize