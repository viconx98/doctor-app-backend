import { Router } from "express";
import { signupValidations, signinValidations } from "../validations/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { patientModel } from "../database/db_config.js";


const patientAuthRouter = Router()

patientAuthRouter.post("/signup", async (request, response) => {
    const authData = request.body

    try {
        await signupValidations.validate(authData)

        const existCheck = await patientModel.findOne({ where: { email: authData.email } })

        if (existCheck !== null) {
            throw new Error("There is already an account associated with this email")
        }

        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(authData.password, salt)

        const newPatient = await patientModel.create({ name: authData.name, email: authData.email, password: hashedPassword })

        console.log(newPatient)

        const userResponse = {
            id: newPatient.get("id"),
            name: newPatient.get("name"),
            email: newPatient.get("email")
        }

        const accessToken = jwt.sign(userResponse, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
        const refreshToken = jwt.sign(userResponse, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })

        return response.status(200)
            .json({
                user: userResponse,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

patientAuthRouter.post("/signin", async (request, response) => {
    const authData = request.body
    console.log(authData)
    try {
        await signinValidations.validate(authData)

        const patient = await patientModel.findOne({ where: { email: authData.email } })

        if (patient === null) {
            throw new Error("There is no account associated with this email")
        }

        const passwordMatch = await bcrypt.compare(authData.password, patient.get("password"))

        if (!passwordMatch) {
            throw new Error("Your password is incorrect")
        }

        const userResponse = {
            id: patient.get("id"),
            name: patient.get("name"),
            email: patient.get("email")
        }

        const accessToken = jwt.sign(userResponse, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
        const refreshToken = jwt.sign(userResponse, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })

        return response.status(200)
            .json({
                user: userResponse,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

// TODO: Refresh token
export default patientAuthRouter