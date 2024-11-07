import * as Yup from 'yup';
import ValidationsConsts from '../../../../consts/validations';

function ServiceInfoFormValidationSchema(isRequired: boolean = true) {
  return Yup.object({
    name: Yup.string().required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    description: Yup.string().required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    price: Yup.number().min(0.01, "Precio mínimo: 0.01 REF").required(isRequired ? ValidationsConsts.REQUIRED : undefined),
    category_id: Yup.number().required(isRequired ? ValidationsConsts.REQUIRED : undefined)
  });
}

export default ServiceInfoFormValidationSchema;
