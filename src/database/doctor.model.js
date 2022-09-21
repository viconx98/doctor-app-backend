import sequelize from "./db_config.js"
import {DataTypes} from "sequelize"

// Create doctor table
const doctorModel = sequelize.define("doctor", {
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
        allowNull: true
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

export default doctorModel