import { useFormik } from "formik";
import { ReactNode, useContext, useEffect } from "react";
import TextComponent from "../../../../../components/inputs/text";
import SelectPlace from "../../../../location/components/select_place";
import PlaceContext from "../../../../location/contexts/place";
import CompanyModel from "../../../model";
import CompnayInfoSchema from "./validation_schema";
import FileDropzone from "../../../../../components/dragndrop/component";

function Container(props: { children: ReactNode }) {
  return (
    <div className='w-full flex flex-col md:flex-row gap-5'>
      { props.children }
    </div>
  )
}

function CompanyInfoForm(props: {initialValues: CompanyModel, onSubmit: (values: CompanyModel) => void; children?: ReactNode}) {

  const { place } = useContext(PlaceContext);

  function onSubmit(values: CompanyModel) {
    props.onSubmit(values);
  }

  const formik = useFormik({initialValues: props.initialValues, onSubmit, validationSchema: CompnayInfoSchema()});

  useEffect(() => {console.log('los errores', formik.errors)}, [formik.errors]);

  useEffect(() => {
    if (place?.town)
      formik.setFieldValue("location_id", place.town.id);
  }, [place?.town]);

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
      <Container>
        <TextComponent
          label="Nombre de la companía"
          name="name"
          key="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.name && formik.touched.name}
          errorMessage={formik.errors.name}
        />
        <TextComponent
          label="RIF"
          name="dni"
          key="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="text"
          isError={formik.errors.dni && formik.touched.dni}
          errorMessage={formik.errors.dni}
        />
      </Container>
      <Container>
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
      </Container>
      <div className='text-center'>
        { formik.errors.company_charter && <span className='text-red-500'>{ formik.errors.company_charter }</span> }
        <FileDropzone
          text="Arrastra el acta constitutiva de la empresa aquí"
          onDrop={(companyCharter) => formik.setFieldValue('company_charter', companyCharter[0])}
        />
      </div>
      <div className='text-center'>
        { formik.errors.company_images && <span className='text-red-500'>{ formik.errors.company_images }</span> }
        <FileDropzone
          text="Arrastra las imágenes de las instalaciones del taller mecánico aquí"
          onDrop={(company_images) => formik.setFieldValue('company_images', company_images)}
        />
      </div>
      <div className='w-full'>
        { props.children }
      </div>
    </form>
  );
}

export default CompanyInfoForm;
