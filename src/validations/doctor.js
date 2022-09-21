import yup from "yup"

export const closeAppointmentValidations = yup.object().shape(
    {
        appointmentId: yup.string()
            .required("appointmentId is a required field")
    }
)

