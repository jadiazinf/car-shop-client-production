import * as Yup from 'yup';
import ValidationsConsts from '../../../../../consts/validations';

function CompnayInfoSchema() {
  return Yup.object().shape({
    name: Yup.string()
      .required(ValidationsConsts.REQUIRED),
    email: Yup.string()
      .email(ValidationsConsts.EMAIL_FORMAT)
      .required(ValidationsConsts.REQUIRED),
    address: Yup.string()
      .required(ValidationsConsts.REQUIRED),
    dni: Yup.string()
      .min(7, ValidationsConsts.MIN_7_CHARACTERS)
      .required(ValidationsConsts.REQUIRED),
    company_charter: Yup.mixed()
                        .test({
                          test: (value) => ValidationsConsts.validatePdfFile(value as File),
                          message: 'Los archivos solo pueden ser de formato PDF' }
                        ).required(ValidationsConsts.REQUIRED),
    company_images: Yup.array().of(
                                    Yup.mixed()
                                      .test({
                                        test: (value) => ValidationsConsts.validateImageFile(value as File),
                                        message: 'Los archivos solo pueden ser de formato JPEG, PNG o JPG' }
                                      ).required(ValidationsConsts.REQUIRED)
                                ).required(ValidationsConsts.REQUIRED),
    location_id: Yup.number()
      .required(ValidationsConsts.REQUIRED),
  });
}

export default CompnayInfoSchema;
