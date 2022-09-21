import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createAppointmentValidations } from "../validations/patient.js";
import doctorModel from "../database/doctor.model.js";
import appointmentModel from "../database/appointment.model.js";
import { intToDay } from "../validations/constants.js";

const patientRouter = Router()

function authorize(request, response, next) {
    const authorization = request.headers.authorization

    try {
        if (authorization === null || authorization === undefined) {
            throw new Error("Invalid access token")
        }

        const token = authorization.split(" ")[1]
        const payload = jwt.verify(token, process.env.PATIENT_ACCESS_TOKEN_SECRET)

        request.user = payload

        next()
    } catch (error) {
        console.error(error)
        return response.status(403)
            .json({ error: true, message: error.message })
    }
}

patientRouter.use(authorize)
// TODO: Get patient's upcoming appointments
// TODO: Give rating and review to doctor

// TODO: Book an appointment
patientRouter.post("/createAppointment", async (request, response) => {
    const patientId = request.user.id
    const appointmentData = request.body

    try {
        await createAppointmentValidations.validate(appointmentData)

        // Check if the doctor id is valid
        const doctor = await doctorModel.findOne({ where: { id: appointmentData.doctorId } })

        if (doctor === null) {
            throw new Error("Doctor id is invalid")
        }

        // Check if the doctor actually prefers this slot on this day
        const appointmentDate = new Date(appointmentData.date)
        const day = intToDay[appointmentDate.getDay()]
        const slot = appointmentData.slot

        console.log(day, slot, doctor)
        const availability = doctor.get("availability") 
        if (availability[day][slot] === undefined) {
            throw new Error("Invalid date or time for the appointment, please recheck the doctor's schedule.")
        }

        // Check if the slot is not already taken
        const existingAppointment = await appointmentModel
            .findOne({
                where: {
                    doctorId: appointmentData.doctorId,
                    date: appointmentDate,
                    slot: Number(slot)
                }
            })

        if (existingAppointment !== null) {
            throw new Error("This slot on this date is already taken, please try a different one.")
        }


        const newAppointment = await appointmentModel.create({
            doctorId: appointmentData.doctorId,
            patientId: patientId,
            date: appointmentDate,
            slot: Number(slot)
        })

        return response.status(200) 
            .json(newAppointment)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

export default patientRouter