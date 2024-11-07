import { ReactNode } from "react";
import CategoryModel from "../../model"
import { useFormik } from "formik";
import CategoryInfoSchema from "./validation_schema";
import TextComponent from "../../../../components/inputs/text";

type CategoryInfoFormProps = {
  initialValues?: CategoryModel;
  children: ReactNode;
  onSubmit: (values: CategoryModel) => void;
}

function CategoryInfoForm(props: CategoryInfoFormProps) {

  const formik = useFormik({
    initialValues: props.initialValues || {} as CategoryModel,
    onSubmit: props.onSubmit,
    validationSchema: CategoryInfoSchema
  });

  return (
    <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
      <TextComponent
        name="name"
        type="text"
        value={formik.values.name}
        label="Nombre de la categoria"
        onChange={formik.handleChange}
        errorMessage={formik.errors.name}
        isError={formik.touched.name && formik.errors.name}
      />
      { props.children }
    </form>
  );
}

export default CategoryInfoForm;
