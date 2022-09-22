import { Router } from "express";
import { signupValidations, signinValidations } from "../validations/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import patientModel from "../database/patient.model.js";
import passwordResetModel from "../database/password_reset.model.js";
import { customAlphabet, urlAlphabet } from "nanoid"

const nanoid = customAlphabet(urlAlphabet, 64)

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

        const userResponse = {
            id: newPatient.get("id"),
            name: newPatient.get("name"),
            email: newPatient.get("email"),
            type: "patient"
        }

        const accessToken = jwt.sign(userResponse, process.env.PATIENT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
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
            email: patient.get("email"),
            type: "patient"
        }

        const accessToken = jwt.sign(userResponse, process.env.PATIENT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
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

patientAuthRouter.post("/requestPasswordReset", async (request, response) => {
    const patientEmail = request.body.email

    try {
        const patient = await patientModel.findOne({ where: { email: patientEmail } })

        if (patient === null) {
            throw new Error("There is no account associated with this email")
        }

        const passwordReset = await passwordResetModel.create({
            patientId: patient.id,
            secret: nanoid()
        })

        // TODO: Send email with secret url

        return response.status(200)
            .json({ message: "The instructions to reset your password has been emailed to " + patientEmail })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

patientAuthRouter.post("/passwordReset", async (request, response) => {
    const secret = request.body.secret
    const newPassword = request.body.newPassword

    try {
        if (newPassword === null || newPassword === undefined || newPassword === ""){
            throw new Error("newPassword is a required field")
        }

        const passwordReset = await passwordResetModel.findOne({ where: { secret: secret } })

        if (passwordReset === null) {
            throw new Error("Invalid password reset secret")
        }

        if (Date.now() > passwordReset.get("createdAt").getTime() + 3600000) {
            throw new Error("Password reset secret expired, please request a new one")
        }

        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const patient = await patientModel.findOne({ where: { id: passwordReset.patientId } })

        await patient.update({
            password: hashedPassword
        })

        await passwordResetModel.destroy({ where: { patientId: patient.id } })

        return response.status(200)
            .json({message: "Your password has been reset successfully"})
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})
// TODO: Refresh token
export default patientAuthRouter