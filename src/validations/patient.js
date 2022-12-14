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


// TODO: Stronger validation on healthHistory
export const patientOnboardValidations = yup.object().shape({
    healthHistory: yup.string()
        .required("healthHistory is a required field"),
    location: yup.string()
        .required("location is a required field"),
    lookingFor: yup.array()
        .min(1, "Please pick at least one type of consultancy you're looking for")
        .required("lookingFor is a required field"),
    age: yup.number()
        .required("age is a required field"),
    gender: yup.string()
        .required("gender is a required field"),
})

export const createAppointmentValidations = yup.object().shape(
    {
        doctorId: yup.string()
            .required("doctorId is a required field"),
        date: yup.string()
            .test(
                "is-valid-date",
                "Invalid date for appointment",
                (date) => new Date(date).toString() !== "Invalid Date"
            )
            .required("date is a required field"),
        slot: yup.string()
            .test(
                "invalid-slot",
                "Invalid slot for appointment",
                (slot) => validSlots[slot] === true
            )
            .required("slot is a required field")
    }
)

export const reviewValidations = yup.object().shape({
    appointmentId: yup.string()
        .required("appointmentId is a required field"),
    rating: yup.number()
        .min(1, "Minimum rating is 1 star")
        .max(5, "Maximum rating is 5 star")
        .required("rating is a required field"),
})

