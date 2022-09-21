import { Router } from "express";
import jwt from "jsonwebtoken"
import { closeAppointmentValidations } from "../validations/doctor.js";
import appointmentModel from "../database/appointment.model.js";

const doctorRouter = Router()

function authorize(request, response, next) {
    const authorization = request.headers.authorization

    try {
        if (authorization === null || authorization === undefined) {
            throw new Error("Invalid access token")
        }

        const token = authorization.split(" ")[1]
        const payload = jwt.verify(token, process.env.DOCTOR_ACCESS_TOKEN_SECRET)

        request.user = payload

        next()
    } catch (error) {
        console.error(error)
        return response.status(403)
            .json({ error: true, message: error.message })
    }
}

doctorRouter.use(authorize)

// TODO: Get all appointments
// TODO: Close appointment
doctorRouter.post("/closeAppointment", async (request, response) => {
    const doctorId = request.user.id
    const appointmentData = request.body

    try {
        await closeAppointmentValidations.validate(appointmentData)

        const appointment = await appointmentModel.findOne({ where: { id: appointmentData.appointmentId } })

        if (appointment === null) {
            throw new Error("Invalid appointment id")
        }
        
        console.log(appointment.get("doctorId"), doctorId)
        if (appointment.get("doctorId") !== doctorId) {
            throw new Error("This appointment doesn't belong to you")
        }

        await appointment.update({
            status: "completed",
            notes: appointmentData.notes,
            prescriptions: appointmentData.prescriptions
        })

        return response.status(200)
            .json(appointment)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})


export default doctorRouter