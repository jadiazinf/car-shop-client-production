import { useFormik } from "formik";
import ServiceModel from "../../model";
import ServiceInfoFormValidationSchema from "./validation_schema";
import TextComponent from "../../../../components/inputs/text";
import SelectComponent from "../../../../components/inputs/select";
import { ReactNode, useEffect, useState } from "react";
import useGetAllCategories from "../../../category/services/get_all/use_get_all_categories";
import CategoryModel from "../../../category/model";
import { NumberInputHelper } from "../../../../components/inputs/helpers";

interface IServiceInfoFormProps {
  initialValues?: ServiceModel;
  onSubmit: (values: ServiceModel) => void;
  requiredFields?: boolean;
  children: ReactNode;
}

function ServiceInfoForm(props: IServiceInfoFormProps) {
  const {
    isGettingAllCategoriesLoading,
    payloadState: categories,
    performGetAllCategories,
  } = useGetAllCategories();

  const [price, setPrice] = useState<string>(
    props.initialValues?.price.toFixed(2) || "0.00"
  );

  const formik = useFormik({
    initialValues: props.initialValues || ({} as ServiceModel),
    onSubmit: props.onSubmit,
    validationSchema: ServiceInfoFormValidationSchema(
      props.requiredFields || true
    ),
  });

  useEffect(() => {
    performGetAllCategories();
    if (props.initialValues?.category || props.initialValues?.category_id)
      formik.setFieldValue(
        "category_id",
        props.initialValues?.category?.id || props.initialValues.category_id
      );
  }, []);

  useEffect(() => {
    formik.setFieldValue("price", parseFloat(price));
  }, [price]);

  function handlePriceChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, price);
    setPrice(value);
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
      <TextComponent
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type="text"
        value={formik.values.name}
        errorMessage={formik.errors.name}
        isError={formik.errors.name && formik.touched.name}
        label="Nombre del servicio"
      />
      <TextComponent
        name="description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        type="text"
        value={formik.values.description}
        errorMessage={formik.errors.description}
        isError={formik.errors.description && formik.touched.description}
        label="Descripción del servicio"
      />
      <SelectComponent
        data={
          categories === "not loaded" ||
          !(categories.payload as CategoryModel[])
            ? []
            : (categories.payload as CategoryModel[]).map((element) => ({
                key: element.id!.toString(),
                label: element.name,
              }))
        }
        name="category_id"
        onChange={formik.handleChange}
        isDisabled={isGettingAllCategoriesLoading}
        value={
          formik.values.category_id?.toString() ||
          props.initialValues?.category?.id?.toString() ||
          ""
        }
        isError={formik.errors.category_id && formik.touched.category_id}
        errorMessage={formik.errors.category_id}
        label="Categoria del servicio"
      />
      <TextComponent
        name="service_type"
        onKeyDown={handlePriceChange}
        value={price}
        isError={formik.errors.price && formik.touched.price}
        errorMessage={formik.errors.price}
        label="Precio (REF)"
        type="text"
      />
      {props.children}
    </form>
  );
}

export default ServiceInfoForm;
