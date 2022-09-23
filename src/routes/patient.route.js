import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createAppointmentValidations, reviewValidations, patientOnboardValidations } from "../validations/patient.js";
import doctorModel from "../database/doctor.model.js";
import appointmentModel from "../database/appointment.model.js";
import patientModel from "../database/patient.model.js";
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

patientRouter.post("/onboard", async (request, response) => {
    const onboardingData = request.body
    const patientId = request.user.id

    try {
        await patientOnboardValidations.validate(onboardingData)

        const patient = await patientModel.findOne({ where: { id: patientId } })

        if (patient === null) {
            throw new Error("Invalid patient id")
        }

        await patient.update({
            healthHistory: onboardingData.healthHistory,
            location: onboardingData.location,
            lookingFor: onboardingData.lookingFor,
            age: onboardingData.age,
            gender: onboardingData.gender,
            onboardingComplete: true
        })


        const safePatient = JSON.parse(JSON.stringify(patient))

        delete safePatient.password

        return response.status(200)
            .json(safePatient)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

patientRouter.get("/onboardStatus", async (request, response) => {
    const patientId = request.user.id

    try {
        const onboardStatus = await patientModel.findOne({
            attributes: ["onboardingComplete"],
            where: { id: patientId }
        })

        return response.status(200)
            .json({ onboardingCompleted: onboardStatus.get("onboardingComplete") })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})


// TODO: Get patient's upcoming appointments
patientRouter.get("/appointments", async (request, response) => {
    const patientId = request.user.id
    const status = request.query.status


    try {
        const filter = {
            where: {
                patientId: patientId
            }
        }

        if (status !== undefined) filter.where.status = status

        const appointments = await appointmentModel.findAll(filter)

        return response.status(200)
            .json(appointments)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

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
                    slot: Number(slot),
                    status: "pending"
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

// TODO: Give rating and review to doctor
patientRouter.post("/rateAndReview", async (request, response) => {
    const patientId = request.user.id
    const ratingData = request.body

    try {
        await reviewValidations.validate(ratingData)

        const appointment = await appointmentModel.findOne({ where: { id: ratingData.appointmentId } })

        if (appointment === null) {
            throw new Error("Invalid appointment id")
        }

        if (appointment.get("status") !== "completed") {
            throw new Error("This appointment hasn't been completed yet")
        }

        if (appointment.get("patientId") !== patientId) {
            throw new Error("This appointment doesn't belong to you")
        }

        await appointment.update(
            {
                rating: ratingData.rating,
                review: ratingData.review
            }
        )

        return response.status(200)
            .json(appointment)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

export default patientRouter