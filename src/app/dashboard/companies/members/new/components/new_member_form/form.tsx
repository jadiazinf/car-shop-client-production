import { useFormik } from "formik";
import TextComponent from "../../../../../../../components/inputs/text";
import { ReactNode, useContext, useEffect } from "react";
import UserModel from "../../../../../../../entities/user/model";
import { Gender } from "../../../../../../../entities/user/types";
import SelectPlace from "../../../../../../../entities/location/components/select_place";
import SelectComponent from "../../../../../../../components/inputs/select";
import { NewMemberSchema } from "./schema";
import PlaceContext from "../../../../../../../entities/location/contexts/place";

interface IProps {
  children?: ReactNode;
  onSubmit: (values: UserModel) => void;
}

const initialValues: UserModel = {
  first_name: "",
  last_name: "",
  dni: "",
  gender: Gender.MALE,
  email: "",
  address: "",
  birthdate: "",
  phone_number: "",
};

function CompanyMemberNewForm(props: IProps) {
  const { place } = useContext(PlaceContext);

  const formik = useFormik({
    initialValues,
    onSubmit: props.onSubmit,
    validationSchema: NewMemberSchema,
  });

  useEffect(() => {
    if (place?.town) formik.setFieldValue("location_id", place.town.id || "");
  }, [place?.town]);

  return (
    <form
      className="flex flex-col gap-2 md:gap-5"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-col md:flex-row gap-5 w-full mt-10">
        <TextComponent
          name="first_name"
          type="text"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Nombre"
          errorMessage={formik.errors.first_name}
          isError={
            formik.touched.first_name && Boolean(formik.errors.first_name)
          }
        />
        <TextComponent
          label="Apellido"
          name="last_name"
          type="text"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.last_name}
          isError={formik.touched.last_name && Boolean(formik.errors.last_name)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <TextComponent
          name="dni"
          type="text"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Cédula"
          errorMessage={formik.errors.dni}
          isError={formik.touched.dni && Boolean(formik.errors.dni)}
        />
        <TextComponent
          label="Correo electrónico"
          name="email"
          type="text"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.email}
          isError={formik.touched.email && Boolean(formik.errors.email)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <SelectComponent
          data={[
            { key: Gender.MALE, label: "Hombre" },
            { key: Gender.FEMALE, label: "Mujer" },
          ]}
          label="Género"
          name="gender"
          onChange={formik.handleChange}
          value={formik.values.gender}
        />
        <TextComponent
          name="phone_number"
          type="text"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Número de teléfono"
          errorMessage={formik.errors.phone_number}
          isError={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
        />
      </div>
      <div>
        <SelectPlace />
      </div>
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <TextComponent
          name="address"
          type="text"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Dirección exacta"
          errorMessage={formik.errors.address}
          isError={formik.touched.address && Boolean(formik.errors.address)}
        />
        <TextComponent
          name="birthdate"
          type="date"
          value={formik.values.birthdate as string}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Fecha de nacimiento"
          errorMessage={formik.errors.birthdate}
          isError={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
        />
      </div>
      {props.children}
    </form>
  );
}

export default CompanyMemberNewForm;
