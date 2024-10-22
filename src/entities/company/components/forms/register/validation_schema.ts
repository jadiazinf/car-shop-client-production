import * as Yup from 'yup';
import ValidationsConsts from '../../../../../consts/validations';

function CompanyInfoSchema(isRequired = true) {
  return Yup.object().shape({
    name: Yup.string()
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    email: Yup.string()
      .email(ValidationsConsts.EMAIL_FORMAT)
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    address: Yup.string()
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    dni: Yup.string()
      .min(7, ValidationsConsts.MIN_7_CHARACTERS)
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    company_charter: Yup.mixed()
      .test({
        test: (value) => {
          if (!isRequired && !value) return true; // Si no es requerido y no hay valor, pasa la validación
          return ValidationsConsts.validatePdfFile(value as File);
        },
        message: 'Los archivos solo pueden ser de formato PDF'
      })
      .when([], {
        is: () => isRequired,
        then: (schema) => schema.required(ValidationsConsts.REQUIRED),
        otherwise: (schema) => schema.notRequired(),
      }),
    company_images: Yup.array().of(
      Yup.mixed()
        .test({
          test: (value) => {
            if (!isRequired && !value) return true; // Si no es requerido y no hay valor, pasa la validación
            return ValidationsConsts.validateImageFile(value as File);
          },
          message: 'Los archivos solo pueden ser de formato JPEG, PNG o JPG'
        })
    ).when([], {
      is: () => isRequired,
      then: (schema) => schema.required(ValidationsConsts.REQUIRED),
      otherwise: (schema) => schema.notRequired(),
    }),
    location_id: Yup.number()
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
  });
}

export default CompanyInfoSchema;
