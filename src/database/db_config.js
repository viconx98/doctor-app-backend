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
    onboardingComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    consultationFees: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qualifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    hospital: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    specialities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    }
})

// TODO: Doctor Availability 

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
    onboardingComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    healthHistory: {
        type: DataTypes.ARRAY(DataTypes.ARRAY((DataTypes.STRING))),
        allowNull: true,
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lookingFor: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    }
})

export default sequelize