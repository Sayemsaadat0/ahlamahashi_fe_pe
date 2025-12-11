import * as yup from "yup";

export const CheckoutValidation = () =>
  yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("This Field is Required"),
    phone: yup
      .string()
      .required("This Field is Required"),
    city_id: yup
      .string()
      .required("This Field is Required")
      .test('is-selected', 'Please select a city', (value) => value !== ''),
    state: yup
      .string()
      .required("This Field is Required"),
    zip_code: yup
      .string()
      .required("This Field is Required"),
    street_address: yup
      .string()
      .required("This Field is Required"),
    notes: yup
      .string()
      .optional(),
  });

