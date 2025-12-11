import * as yup from "yup";

export const ContactValidation = () =>
  yup.object().shape({
    name: yup.string().required("This Field is Required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("This Field is Required"),
    phone: yup
      .string()
      .optional(),
    subject: yup
      .string()
      .required("This Field is Required"),
    message: yup
      .string()
      .required("This Field is Required"),
  });

