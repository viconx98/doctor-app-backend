import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import morgan from "morgan"
import jwt from "jsonwebtoken"
import sequelize from "./database/db_config.js"

import doctorAuthRouter from "./routes/doctor_auth.route.js"
import patientAuthRouter from "./routes/patient_auth.route.js"


import * as path from "path"
import * as url from "url"
import patientRouter from "./routes/patient.route.js"
import doctorRouter from "./routes/doctor.route.js"
import { qualifications, specialities } from "./validations/constants.js"
import qualificationsModel from "./database/qualifications.model.js"
import specialityModel from "./database/speciality.model.js"
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const expressApp = express()

expressApp.use(cors())
expressApp.use(express.json())
// expressApp.use(express.urlencoded({ extended: true }))
expressApp.use(morgan("dev"))

// expressApp.use(express.static("public"))
// expressApp.use(express.static(path.join(__dirname, "public")))

expressApp.get("/", (request, response) => {
    return response.status(200).send("Doctor App API is up and running")
})

const PORT = process.env.PORT || 3001

expressApp.use("/doctor/auth", doctorAuthRouter)
expressApp.use("/patient/auth", patientAuthRouter)

expressApp.use("/patient", patientRouter)
expressApp.use("/doctor", doctorRouter)

try {
    // await sequelize.sync({force: true})
    await sequelize.authenticate()

    // // TODO: Comment out on deploy
    // for (const qualification of qualifications) {
    //     await qualificationsModel.create({title: qualification})
    // }

    // // TODO: Comment out on deploy
    // for (const speciality of specialities) {
    //     await specialityModel.create({title: speciality})
    // }

    expressApp.listen(PORT, () => console.log("Express server up and running on", PORT))
} catch (error) {
    console.log("Connection to database failed with ", error)
}