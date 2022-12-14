import { Router } from "express";
import { signupValidations, signinValidations } from "../validations/auth.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import doctorModel from "../database/doctor.model.js";
import passwordResetModel from "../database/password_reset.model.js";
import { customAlphabet, urlAlphabet } from "nanoid"
import mailgun from "mailgun-js"

const nanoid = customAlphabet(urlAlphabet, 64)

const mg = mailgun({ apiKey: process.env.MG_API_KEY, domain: "sandbox70f120240379468c9bfaa7eaeb43009e.mailgun.org" });

// const mailTemplate = (resetLink) => {
//     return `<!DOCTYPE html>
//     <html>
//     <head>
//     <title>Page Title</title>
//     </head>
//     <body style="display: flex; flex-direction: column; justify-conent: center; align-items: center;">
    
//     <h1>Password Reset Request</h1>
//     <p>Please go to the following link to reset the password</p>
//     <a href="${resetLink}"><h2>Reset Password</h2></a>
//     </body>
//     </html>`
// }

const mailTemplate = (resetLink) => {
    return resetLink
}


const doctorAuthRouter = Router()

doctorAuthRouter.post("/signup", async (request, response) => {
    const authData = request.body

    try {
        await signupValidations.validate(authData)

        const existCheck = await doctorModel.findOne({ where: { email: authData.email } })

        if (existCheck !== null) {
            throw new Error("There is already an account associated with this email")
        }

        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(authData.password, salt)

        const newDoctor = await doctorModel.create({ name: authData.name, email: authData.email, password: hashedPassword })

        const userResponse = {
            id: newDoctor.get("id"),
            name: newDoctor.get("name"),
            email: newDoctor.get("email"),
            type: "doctor"
        }

        const accessToken = jwt.sign(userResponse, process.env.DOCTOR_ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
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

doctorAuthRouter.post("/signin", async (request, response) => {
    const authData = request.body

    try {
        await signinValidations.validate(authData)

        const doctor = await doctorModel.findOne({ where: { email: authData.email } })

        if (doctor === null) {
            throw new Error("There is no account associated with this email")
        }

        const passwordMatch = await bcrypt.compare(authData.password, doctor.get("password"))

        if (!passwordMatch) {
            throw new Error("Your password is incorrect")
        }

        const userResponse = {
            id: doctor.get("id"),
            name: doctor.get("name"),
            email: doctor.get("email"),
            type: "doctor"
        }

        const accessToken = jwt.sign(userResponse, process.env.DOCTOR_ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
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

doctorAuthRouter.post("/requestPasswordReset", async (request, response) => {
    const doctorEmail = request.body.email

    try {
        const doctor = await doctorModel.findOne({ where: { email: doctorEmail } })

        if (doctor === null) {
            throw new Error("There is no account associated with this email")
        }

        const secret = nanoid() 
        const passwordReset = await passwordResetModel.create({
            doctorId: doctor.id,
            secret: secret
        })

        // TODO: Replace url with deployment url
        const data = {
            from: 'Doctor App Auth <me@sandbox70f120240379468c9bfaa7eaeb43009e.mailgun.org>',
            to: doctorEmail,
            subject: 'Password Reset Request',
            text: mailTemplate(`${process.env.DEPLOY_URL}/auth/resetPassword?secret=${secret}&type=doctor`)
        };
        
        mg.messages().send(data, function (error, body) {
            if (error) {
                console.error(error)
            } else {
                console.log("Mail sent successfully")
            }
        });


        return response.status(200)
            .json({ message: "The instructions to reset your password has been emailed to " + doctorEmail })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

doctorAuthRouter.post("/passwordReset", async (request, response) => {
    const secret = request.body.secret
    const newPassword = request.body.newPassword

    try {
        if (newPassword === null || newPassword === undefined || newPassword === "") {
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

        const doctor = await doctorModel.findOne({ where: { id: passwordReset.doctorId } })

        await doctor.update({
            password: hashedPassword
        })

        await passwordResetModel.destroy({ where: { doctorId: doctor.id } })

        return response.status(200)
            .json({ message: "Your password has been reset successfully" })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})


// TODO: Refresh token
export default doctorAuthRouter