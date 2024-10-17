import * as Yup from 'yup';
import ValidationsConsts from '../../../../../consts/validations';

function VehicleInfoSchema() {
  return Yup.object({
    color: Yup.string().required(ValidationsConsts.REQUIRED),
    license_plate: Yup.string().required(ValidationsConsts.REQUIRED).min(6, ValidationsConsts.MIN_6_CHARACTERS),
    photos: Yup.array().of(
                            Yup.mixed()
                              .test({
                                test: (value) => ValidationsConsts.validateImageFile(value as File),
                                message: 'Los archivos solo pueden ser de formato JPEG, PNG o JPG' }
                              ).required(ValidationsConsts.REQUIRED)
            ).required(ValidationsConsts.REQUIRED),
    year: Yup.number().required(ValidationsConsts.REQUIRED).min(1800, 'Año no válido, debe ser mayor a 1800'),
    axles: Yup.number().required(ValidationsConsts.REQUIRED).min(1, 'Mínimo 1'),
    tires: Yup.number().required(ValidationsConsts.REQUIRED).min(2, 'Mínimo 2'),
    vehicle_type: Yup.string().required(ValidationsConsts.REQUIRED),
    load_capacity: Yup.number().min(1000, "Mínima cantidad, 1000lts"),
    engine_serial: Yup.string(),
    body_serial: Yup.string().min(6, ValidationsConsts.MIN_6_CHARACTERS),
    engine_type: Yup.string(),
    transmission: Yup.string().required(ValidationsConsts.REQUIRED)
  });
}

export default VehicleInfoSchema;
