import * as Yup from "yup";
import ValidationsConsts from "../../../../consts/validations";

function ServiceInfoFormValidationSchema(isRequired: boolean = true) {
  return Yup.object({
    name: Yup.string().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
    description: Yup.string().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
    price_for_motorbike: Yup.number()
      .nullable()
      .min(0.01, "Precio mínimo: 0.01 REF"),
    price_for_car: Yup.number().nullable().min(0.01, "Precio mínimo: 0.01 REF"),
    price_for_van: Yup.number().nullable().min(0.01, "Precio mínimo: 0.01 REF"),
    price_for_truck: Yup.number()
      .nullable()
      .min(0.01, "Precio mínimo: 0.01 REF"),
    category_id: Yup.number().required(
      isRequired ? ValidationsConsts.REQUIRED : undefined
    ),
  });
}

export default ServiceInfoFormValidationSchema;
