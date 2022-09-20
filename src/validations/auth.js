import yup from "yup"

export const signupValidations = yup.object().shape({
    name: yup.string()
        .min(3, "Username is too short at least 3 characters are required")
        .max(20, "Username is too long at only 20 characters are allowed")
        .required("username is required field"),

    email: yup.string()
        .email("Invalid email")
        .required("email is a required field"),

    password: yup.string()
        .min(6, "Password is too short at least 6 characters are required")
        .max(50, "Password is too long only 50 characters are allowed")
        .required("password is required field")
})

export const signinValidations = yup.object().shape({
    email: yup.string()
        .email("Invalid email")
        .required("email is a required field"),

    password: yup.string()
        .required("password is required field")
})


export const doctorOnboardValidations = yup.object().shape({
    doctorId: yup.string()
        .required("doctorId is a required field"),
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

// TODO: Stronger validation on healthHistory
export const patientOnboardValidations = yup.object().shape({
    patientId: yup.string()
        .required("patientId is a required field"),
    healthHistory: yup.array()
        .required("healthHistory is a required field"),
    location: yup.string()
        .required("location is a required field"),
    lookingFor: yup.array()
        .min(1, "Please pick at least one type of consultancy you're looking for")
        .required("lookingFor is a required field"),
})