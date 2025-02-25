import * as Yup from "yup";
import ValidationsConsts from "../../../../../consts/validations";

function CompanyInfoSchema(isRequired = true) {
  return Yup.object().shape({
    name: Yup.string().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
    email: Yup.string()
      .email(ValidationsConsts.EMAIL_FORMAT)
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    address: Yup.string().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
    dni: Yup.string()
      .min(7, ValidationsConsts.MIN_7_CHARACTERS)
      .required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    company_charter: Yup.mixed()
      .test({
        test: (value) => {
          if (!isRequired && !value) return true;

          if (typeof value === "string") return true;

          return ValidationsConsts.validatePdfFile(value as File);
        },
        message: "El archivo debe ser un PDF o un string válido",
      })
      .when([], {
        is: () => isRequired,
        then: (schema) => schema.required(ValidationsConsts.REQUIRED),
        otherwise: (schema) => schema.notRequired(),
      }),
    company_images: Yup.array()
      .of(
        Yup.mixed().test({
          test: (value) => {
            if (!isRequired && !value) return true;

            if (typeof value === "string") return true;

            return ValidationsConsts.validateImageFile(value as File);
          },
          message:
            "Los archivos deben ser imágenes (JPEG, PNG, JPG) o strings válidos",
        })
      )
      .when([], {
        is: () => isRequired,
        then: (schema) => schema.required(ValidationsConsts.REQUIRED),
        otherwise: (schema) => schema.notRequired(),
      }),
    location_id: Yup.number().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
  });
}

export default CompanyInfoSchema;
