import yup from "yup"

const validSlots = {
    "0": true,
    "30": true,
    "60": true,
    "90": true,
    "120": true,
    "150": true,
    "180": true,
    "210": true,
    "240": true,
    "270": true,
    "300": true,
    "330": true,
    "360": true,
    "390": true,
    "420": true,
    "450": true,
    "480": true,
    "510": true,
    "540": true,
    "570": true,
    "600": true,
    "630": true,
    "660": true,
    "690": true,
    "720": true,
    "750": true,
    "780": true,
    "810": true,
    "840": true,
    "870": true,
    "900": true,
    "930": true,
    "960": true,
    "990": true,
    "1020": true,
    "1050": true,
    "1080": true,
    "1110": true,
    "1140": true,
    "1170": true,
    "1200": true,
    "1230": true,
    "1260": true,
    "1290": true,
    "1320": true,
    "1350": true,
    "1380": true,
    "1410": true
}

const validDays = {
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": true,
    "sunday": true
}


export const doctorOnboardValidations = yup.object().shape({
    consultationFees: yup.number()
        .min(1, "Invalid consultation fees")
        .required("consultationFees is a required field"),

    qualifications: yup.array()
        .min(1, "Please pick at least one qualification")
        .required("qualifications is a required field"),
    experience: yup.number()
        .required("experience is a required field"),
    location: yup.string()
        .required("location is a required field"),
    specialities: yup.array()
        .min(1, "Please pick at least one speciality")
        .required("specialities is a required field"),
})

// TODO: Maybe even do validation for empty day keys with no slots
export const doctorAvailabilityValidations = yup.object()
    .test(
        "has-valid-days",
        "Availability data contains invalid days",
        (availability) => Object.keys(availability).every(key => validDays[key] === true)
    ).test(
        "has-valid-slots",
        "Availability data has inconsistent or invalid slots",
        (availability) => {
            // Go over every day key
            for (const key in availability) {
                // Get the slot object for a particular day
                const slots = availability[key]

                // Make sure that every key in slots object adheres to 30 min duration
                const everySlotValid = Object.keys(slots).every(key => validSlots[key] === true)

                if (!everySlotValid) return false
            }

            return true
        }
    )

export const closeAppointmentValidations = yup.object().shape(
    {
        appointmentId: yup.number()
            .required("appointmentId is a required field")
    }
)

