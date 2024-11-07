import * as Yup from 'yup';
import ValidationsConsts from '../../../../consts/validations';

function CategoryInfoSchema() {
  return Yup.object({
    name: Yup.string().required(ValidationsConsts.REQUIRED)
  });

}

export default CategoryInfoSchema;
