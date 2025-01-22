import { useFormik } from "formik";
import ServiceModel from "../../model";
import ServiceInfoFormValidationSchema from "./validation_schema";
import TextComponent from "../../../../components/inputs/text";
import SelectComponent from "../../../../components/inputs/select";
import { ReactNode, useEffect, useState } from "react";
import useGetAllCategories from "../../../category/services/get_all/use_get_all_categories";
import CategoryModel from "../../../category/model";
import { NumberInputHelper } from "../../../../components/inputs/helpers";
import { Checkbox } from "@nextui-org/react";
import { RiEBikeLine } from "react-icons/ri";
import { FaCar } from "react-icons/fa";
import { FaTruckField, FaTruckFront } from "react-icons/fa6";

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

  const [applicablePrices, setApplicablePrices] = useState<{
    motorbike: boolean;
    car: boolean;
    van: boolean;
    truck: boolean;
  }>({
    car: true,
    motorbike: true,
    truck: true,
    van: true,
  });

  const [priceForMotorbike, setPriceForMotorbike] = useState<string | null>(
    (props.initialValues?.price_for_motorbike as number)?.toFixed(2) || "0.00"
  );

  const [priceForCar, setPriceForCar] = useState<string | null>(
    (props.initialValues?.price_for_car as number)?.toFixed(2) || "0.00"
  );

  const [priceForVan, setPriceForVan] = useState<string | null>(
    (props.initialValues?.price_for_van as number)?.toFixed(2) || "0.00"
  );

  const [priceForTruck, setPriceForTruck] = useState<string | null>(
    (props.initialValues?.price_for_truck as number)?.toFixed(2) || "0.00"
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
    if (priceForMotorbike)
      formik.setFieldValue(
        "price_for_motorbike",
        parseFloat(priceForMotorbike)
      );
    else formik.setFieldValue("price_for_motorbike", null);
  }, [priceForMotorbike]);

  useEffect(() => {
    if (priceForCar)
      formik.setFieldValue("price_for_car", parseFloat(priceForCar));
    else formik.setFieldValue("price_for_car", null);
  }, [priceForCar]);

  useEffect(() => {
    if (priceForVan)
      formik.setFieldValue("price_for_van", parseFloat(priceForVan));
    else formik.setFieldValue("price_for_van", null);
  }, [priceForVan]);

  useEffect(() => {
    if (priceForTruck)
      formik.setFieldValue("price_for_truck", parseFloat(priceForTruck));
    else formik.setFieldValue("price_for_truck", null);
  }, [priceForTruck]);

  useEffect(() => {
    if (!applicablePrices.motorbike) setPriceForMotorbike(null);
    else setPriceForMotorbike("0.00");
  }, [applicablePrices.motorbike]);

  useEffect(() => {
    if (!applicablePrices.car) setPriceForCar(null);
    else setPriceForCar("0.00");
  }, [applicablePrices.car]);

  useEffect(() => {
    if (!applicablePrices.van) setPriceForVan(null);
    else setPriceForVan("0.00");
  }, [applicablePrices.van]);

  useEffect(() => {
    if (!applicablePrices.truck) setPriceForTruck(null);
    else setPriceForTruck("0.00");
  }, [applicablePrices.truck]);

  function handlePriceForMotorbikeChange(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    const value = NumberInputHelper.handleChange(
      e,
      priceForMotorbike as string
    );
    setPriceForMotorbike(value);
  }

  function handlePriceForCarChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, priceForCar as string);
    setPriceForCar(value);
  }

  function handlePriceForVanChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, priceForVan as string);
    setPriceForVan(value);
  }

  function handlePriceForTruckChange(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = NumberInputHelper.handleChange(e, priceForTruck as string);
    setPriceForTruck(value);
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
      <div className="flex items-center gap-2">
        <Checkbox
          size="md"
          radius="sm"
          isSelected={!applicablePrices.motorbike}
          onValueChange={() =>
            setApplicablePrices((prev) => ({
              ...prev,
              motorbike: !prev.motorbike,
            }))
          }
        >
          N/A
        </Checkbox>
        <TextComponent
          name="price_for_motorbike"
          onKeyDown={handlePriceForMotorbikeChange}
          value={priceForMotorbike || ""}
          startContent={<RiEBikeLine />}
          isError={
            formik.errors.price_for_motorbike &&
            formik.touched.price_for_motorbike
          }
          errorMessage={formik.errors.price_for_motorbike}
          label="Precio para moto (REF)"
          type="text"
          isDisabled={!applicablePrices.motorbike}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          size="md"
          radius="sm"
          isSelected={!applicablePrices.car}
          onValueChange={() =>
            setApplicablePrices((prev) => ({
              ...prev,
              car: !prev.car,
            }))
          }
        >
          N/A
        </Checkbox>
        <TextComponent
          name="price_for_car"
          onKeyDown={handlePriceForCarChange}
          startContent={<FaCar />}
          value={priceForCar || ""}
          isError={formik.errors.price_for_car && formik.touched.price_for_car}
          errorMessage={formik.errors.price_for_car}
          label="Precio para carro (REF)"
          type="text"
          isDisabled={!applicablePrices.car}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          size="md"
          radius="sm"
          isSelected={!applicablePrices.van}
          onValueChange={() =>
            setApplicablePrices((prev) => ({
              ...prev,
              van: !prev.van,
            }))
          }
        >
          N/A
        </Checkbox>
        <TextComponent
          name="price_for_var"
          onKeyDown={handlePriceForVanChange}
          value={priceForVan || ""}
          startContent={<FaTruckField />}
          isError={formik.errors.price_for_van && formik.touched.price_for_van}
          errorMessage={formik.errors.price_for_van}
          label="Precio para camioneta (REF)"
          type="text"
          isDisabled={!applicablePrices.van}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          size="md"
          radius="sm"
          isSelected={!applicablePrices.truck}
          onValueChange={() =>
            setApplicablePrices((prev) => ({
              ...prev,
              truck: !prev.truck,
            }))
          }
        >
          N/A
        </Checkbox>
        <TextComponent
          name="price_for_truck"
          onKeyDown={handlePriceForTruckChange}
          value={priceForTruck || ""}
          startContent={<FaTruckFront />}
          isError={
            formik.errors.price_for_truck && formik.touched.price_for_truck
          }
          errorMessage={formik.errors.price_for_truck}
          label="Precio para camión (REF)"
          type="text"
          isDisabled={!applicablePrices.truck}
        />
      </div>
      {props.children}
    </form>
  );
}

export default ServiceInfoForm;
