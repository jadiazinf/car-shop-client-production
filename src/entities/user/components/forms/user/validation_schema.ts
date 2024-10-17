import * as Yup from "yup";
import ValidationsConsts from "../../../../../consts/validations";
import DatesHelpers from "../../../../../helpers/dates/helper";

function isOlderThan18years(value: string) {
  if (!value) return false;

  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  return age > 18 || (age === 18 && monthDiff > 0) || (age === 18 && monthDiff === 0 && today.getDate() >= birthDate.getDate());
}

function UserInfoSchema() {
  return Yup.object({
    first_name: Yup.string().required(ValidationsConsts.REQUIRED),
    last_name: Yup.string().required(ValidationsConsts.REQUIRED),
    dni: Yup.string().required(ValidationsConsts.REQUIRED).min(8, ValidationsConsts.MIN_8_CHARACTERS),
    gender: Yup.string().required().oneOf(["Male", "Female"], "Valor erróneo"),
    email: Yup.string().email(ValidationsConsts.EMAIL_FORMAT),
    password: Yup.string().required(ValidationsConsts.REQUIRED).min(8, ValidationsConsts.MIN_8_CHARACTERS),
    password_confirmation: Yup.string().oneOf([Yup.ref('password')], ValidationsConsts.PASSWORD_CONFIRMAION),
    address: Yup.string().required(ValidationsConsts.REQUIRED),
    birthdate: Yup.string().required(ValidationsConsts.REQUIRED)
                  .test({test: (value) => DatesHelpers.isInvalidDate(value) === false, message: 'No es un formato de fecha válido'})
                  .test({test: isOlderThan18years, message: ValidationsConsts.VALID_AGE}),
    location_id: Yup.number().min(1).required(ValidationsConsts.REQUIRED),
    phone_number: Yup.string().required(ValidationsConsts.REQUIRED).min(11, ValidationsConsts.VALID_PHONE_NUMBER)
  });
}

export default UserInfoSchema;
