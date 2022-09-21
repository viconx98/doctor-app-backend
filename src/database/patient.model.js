import sequelize from "./db_config.js"
import {DataTypes} from "sequelize"


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
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    gender: {
        type: DataTypes.TEXT,
        allowNull: true
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

// Age, gender

export default patientModel