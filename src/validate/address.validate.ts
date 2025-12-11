import * as yup from "yup";

export const AddressValidation = () =>
  yup.object().shape({
    street: yup.string().required("This Field is Required"),
    city_id: yup
      .string()
      .required("This Field is Required")
      .test('is-selected', 'Please select a city', (value) => value !== ''),
    state: yup.string().required("This Field is Required"),
    zipCode: yup.string().required("This Field is Required"),
  });

