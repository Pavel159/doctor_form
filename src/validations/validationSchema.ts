import * as Yup from 'yup';

const emailMask =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneMask = /^\+?3?8?(0\d{9})$/;

const validationSchema = Yup.object().shape(
  {
    name: Yup.string()
      .required('Field is required')
      .matches(/^[aA-zZ\s]+$/, 'Please use only letters'),
    birthdate: Yup.string().required('Field is required'),
    sex: Yup.string().required('Field is required'),
    city: Yup.string().required('Field is required'),
    doctor: Yup.string().required('Field is required'),
    email: Yup.string().when('phone', {
      is: (phone: string) => !phone || phone.length === 0,
      then: () =>
        Yup.string()
          .required('Field is required')
          .matches(
            emailMask,
            'Please enter valid email (format: example@mail.com)'
          ),
      otherwise: () =>
        Yup.string().matches(
          emailMask,
          'Please enter valid email (format: example@mail.com)'
        ),
    }),
    phone: Yup.string().when('email', {
      is: (email: string) => !email || email.length === 0,
      then: () =>
        Yup.string()
          .required('Field is required')
          .matches(
            phoneMask,
            'Please enter valid phone number (format: +38XXXXXXXXXX)'
          ),
      otherwise: () =>
        Yup.string().matches(
          phoneMask,
          'Please enter valid phone number (format: +38XXXXXXXXXX)'
        ),
    }),
  },
  [['phone', 'email']]
);

// const validationSchema = yup.object().shape(
//   {
//     email: yup
//       .string()
//       .email()
//       .when('phone', {
//         is: (phone) => !phone || phone.length === 0,
//         then: () => yup.string().email().required(),
//         otherwise: () => yup.string(),
//       }),
//     phone: yup.string().when('email', {
//       is: (email) => !email || email.length === 0,
//       then: () => yup.string().required(),
//       otherwise: () => yup.string(),
//     }),
//   },
//   [['email', 'phone']]
// );

// const validationSchema = Yup.object().shape({
//   aCheckbox: Yup.boolean('Select this checkbox a please'),
//   bCheckbox: Yup.boolean('Select this checkbox b please'),
//   anotherField: Yup.string().when(['aCheckbox', 'bCheckbox'], {
//     is: (aCheckbox, bCheckbox) => aCheckbox === true && bCheckbox === true,
//     then: Yup.string().required(
//       'I am required now that both checkboxes are checked'
//     ),
//   }),
// });

export default validationSchema;
