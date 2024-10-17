import UserModel from "../../../model";
import { useFormik } from "formik";
import UserInfoSchema from "./validation_schema";
import { ReactNode, useContext, useEffect } from "react";
import TextComponent from "../../../../../components/inputs/text";
import SelectComponent from "../../../../../components/inputs/select";
import SelectPlace from "../../../../location/components/select_place";
import { Gender } from "../../../types";
import PlaceContext from "../../../../location/contexts/place";

function Container(props: { children: ReactNode }) {
  return (
    <div className='w-full flex flex-col md:flex-row gap-5'>
      { props.children }
    </div>
  )
}

function UserInfoForm(props: {initialValues: UserModel, onSubmit: (values: UserModel) => void; children?: ReactNode}) {

  const { place } = useContext(PlaceContext);

  function onSubmit(values: UserModel) {
    props.onSubmit(values);
  }

  const formik = useFormik({initialValues: props.initialValues, onSubmit, validationSchema: UserInfoSchema()});

  useEffect(() => {
    if (place?.town)
      formik.setFieldValue("location_id", place.town.id);
  }, [place?.town]);

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
      <Container>
        <TextComponent
          label="Nombre"
          name="first_name"
          key="first_name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.first_name && formik.touched.first_name}
          errorMessage={formik.errors.first_name}
        />
        <TextComponent
          label="Apellido"
          name="last_name"
          key="last_name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.last_name && formik.touched.last_name}
          errorMessage={formik.errors.last_name}
        />
      </Container>
      <Container>
        <TextComponent
          label="Cédula de identidad"
          name="dni"
          key="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.dni && formik.touched.dni}
          errorMessage={formik.errors.dni}
        />
        <SelectComponent
          data={[{ key: Gender.MALE, label: 'Hombre' }, { key: Gender.FEMALE, label: 'Mujer' }]}
          key="gender"
          name="gender"
          label="Género"
          onChange={formik.handleChange}
          value={formik.values.gender}
          isError={formik.errors.gender && formik.touched.gender}
          errorMessage={formik.errors.gender}
          onBlur={formik.handleBlur}
        />
      </Container>
      <Container>
        <TextComponent
          label="Fecha de nacimiento"
          name="birthdate"
          key="birthdate"
          value={formik.values.birthdate as string}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="date"
          isError={formik.errors.birthdate && formik.touched.birthdate}
          errorMessage={formik.errors.birthdate}
        />
        <TextComponent
          label="Correo electrónico"
          name="email"
          key="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.email && formik.touched.email}
          errorMessage={formik.errors.email}
        />
      </Container>
      <Container>
        <TextComponent
          label="Contraseña"
          name="password"
          key="password"
          value={formik.values.password!}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="password"
          isError={formik.errors.password && formik.touched.password}
          errorMessage={formik.errors.password}
        />
        <TextComponent
          label="Confirmación de contraseña"
          name="password_confirmation"
          key="password_confirmation"
          value={formik.values.password_confirmation!}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="password"
          isError={formik.errors.password_confirmation && formik.touched.password_confirmation}
          errorMessage={formik.errors.password_confirmation}
        />
      </Container>
      <div className='flex flex-col gap-2'>
        <SelectPlace />
        {
          formik.errors.location_id && formik.touched.location_id &&
          <span className='text-red-400'>{ formik.errors.location_id }</span>
        }
      </div>
      <Container>
        <TextComponent
          label="Dirección exacta"
          name="address"
          key="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.address && formik.touched.address}
          errorMessage={formik.errors.address}
        />
        <TextComponent
          label="Número de teléfono"
          name="phone_number"
          key="phone_number"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.phone_number && formik.touched.phone_number}
          errorMessage={formik.errors.phone_number}
        />
      </Container>
      <div className='w-full'>
        { props.children }
      </div>
    </form>
  );
}

export default UserInfoForm;
