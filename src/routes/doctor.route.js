import { Router } from "express";
import jwt from "jsonwebtoken"
import { closeAppointmentValidations, doctorOnboardValidations, doctorAvailabilityValidations } from "../validations/doctor.js";
import appointmentModel from "../database/appointment.model.js";
import doctorModel from "../database/doctor.model.js";

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

doctorRouter.post("/onboard", async (request, response) => {
    const onboardingData = request.body
    const doctorId = request.user.id

    try {
        await doctorOnboardValidations.validate(onboardingData)
        await doctorAvailabilityValidations.validate(onboardingData.availability)

        const doctor = await doctorModel.findOne({ where: { id: doctorId } })

        if (doctor === null) {
            throw new Error("Invalid doctor id")
        }

        await doctor.update({
            qualifications: onboardingData.qualifications,
            experience: onboardingData.experience,
            hospital: onboardingData.hospital,
            location: onboardingData.location,
            specialities: onboardingData.specialities,
            availability: onboardingData.availability,
            onboardingComplete: true
        })


        const safeDoctor = JSON.parse(JSON.stringify(doctor))

        delete safeDoctor.password

        return response.status(200)
            .json(safeDoctor)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

// TODO: Get all appointments
doctorRouter.get("/appointments", async (request, response) => {
    const doctorId = request.user.id
    const status = request.query.status

    try {
        const filter = {
            where: {
                doctorId: doctorId
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