import { useFormik } from "formik";
import VehicleModel from "../../../model";
import VehicleInfoSchema from "./validation_schema";
import { ReactNode } from "react";
import SelectBrandAndModelComponent from "../../../../model/components/select_brand_and_model";
import SelectComponent from "../../../../../components/inputs/select";
import { VEHICLE_COLORS } from "../../../../../consts/colors";
import TextComponent from "../../../../../components/inputs/text";
import DatesHelpers from "../../../../../helpers/dates/helper";
import {
  ENGINE_TYPE_ARR,
  VEHICLE_TRANSMISSION_ARR,
  VEHICLE_TYPES_ARR,
} from "../../../types";
import FileDropzone from "../../../../../components/dragndrop/component";
import ViewImagesComponent from "../../../../../components/images/view_images";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import ButtonComponent from "../../../../../components/buttons/component";

function Container(props: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-5">
      {props.children}
    </div>
  );
}

function VehicleInfoForm(props: {
  initialValues: VehicleModel;
  onSubmit: (values: VehicleModel) => void;
  children?: ReactNode;
}) {
  const {
    isOpen: isShowImagesOpen,
    onOpen: onShowImagesOpen,
    onOpenChange: onShowImagesOpenChange,
  } = useDisclosure();

  function onSubmit(values: VehicleModel) {
    props.onSubmit(values);
  }

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit,
    validationSchema: VehicleInfoSchema,
  });

  return (
    <>
      <Modal
        isOpen={isShowImagesOpen}
        onOpenChange={onShowImagesOpenChange}
        size="2xl"
        radius="sm"
      >
        <ModalBody>
          <ModalContent>
            <div className="py-10">
              <ViewImagesComponent
                isCommingFrom="client"
                images={formik.values.vehicle_images as File[]}
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        <SelectBrandAndModelComponent />
        <Container>
          <SelectComponent
            label="Color"
            data={VEHICLE_COLORS.map((element) => ({
              key: element,
              label: element,
            }))}
            key="color"
            name="color"
            onChange={formik.handleChange}
            value={formik.values.color}
            isError={formik.errors.color && formik.touched.color}
            errorMessage={formik.errors.color}
            onBlur={formik.handleBlur}
          />
          <TextComponent
            label="Placa"
            key="license_plate"
            name="license_plate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.license_plate}
            isError={
              formik.errors.license_plate && formik.touched.license_plate
            }
            errorMessage={formik.errors.license_plate}
          />
        </Container>
        <Container>
          <SelectComponent
            label="Año"
            data={DatesHelpers.getYearsDescending().map((year) => ({
              key: year.toString(),
              label: year.toString(),
            }))}
            key="year"
            name="year"
            onChange={formik.handleChange}
            value={formik.values.year?.toString() || ""}
            isError={formik.errors.year && formik.touched.year}
            errorMessage={formik.errors.year}
            onBlur={formik.handleBlur}
          />
          <SelectComponent
            label="Cantidad de ejes"
            data={[1, 2, 3, 4, 5, 6].map((element) => ({
              key: element.toString(),
              label: element.toString(),
            }))}
            key="axles"
            name="axles"
            onChange={formik.handleChange}
            value={formik.values.axles?.toString() || ""}
            isError={formik.errors.axles && formik.touched.axles}
            errorMessage={formik.errors.axles}
            onBlur={formik.handleBlur}
          />
        </Container>
        <Container>
          <SelectComponent
            label="Tipo de vehículo"
            data={VEHICLE_TYPES_ARR.map((type) => ({
              key: type.key,
              label: type.label,
            }))}
            key="vehicle_type"
            name="vehicle_type"
            onChange={formik.handleChange}
            value={formik.values.vehicle_type || ""}
            isError={formik.errors.vehicle_type && formik.touched.vehicle_type}
            errorMessage={formik.errors.vehicle_type}
            onBlur={formik.handleBlur}
          />
          <TextComponent
            label="Capacidad de carga"
            key="load_capacity"
            name="load_capacity"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.load_capacity?.toString() || ""}
            isError={
              formik.errors.load_capacity && formik.touched.load_capacity
            }
            errorMessage={formik.errors.load_capacity}
          />
        </Container>
        <Container>
          <TextComponent
            label="Serial de motor"
            key="engine_serial"
            name="engine_serial"
            onChange={formik.handleChange}
            value={formik.values.engine_serial || ""}
            isError={
              formik.errors.engine_serial && formik.touched.engine_serial
            }
            errorMessage={formik.errors.engine_serial}
            onBlur={formik.handleBlur}
            type="text"
          />
          <TextComponent
            label="Serial de chasis"
            key="body_serial"
            name="body_serial"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.body_serial?.toString() || ""}
            isError={formik.errors.body_serial && formik.touched.body_serial}
            errorMessage={formik.errors.load_capacity}
          />
        </Container>
        <Container>
          <SelectComponent
            label="Tipo de motor"
            key="engine_type"
            name="engine_type"
            onChange={formik.handleChange}
            value={formik.values.engine_type || ""}
            isError={formik.errors.engine_type && formik.touched.engine_type}
            errorMessage={formik.errors.engine_type}
            onBlur={formik.handleBlur}
            data={ENGINE_TYPE_ARR.map((element) => ({
              key: element.key,
              label: element.label,
            }))}
          />
          <SelectComponent
            label="Transmisión"
            key="transmission"
            name="transmission"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            data={VEHICLE_TRANSMISSION_ARR.map((element) => ({
              key: element.key,
              label: element.label,
            }))}
            value={formik.values.transmission || ""}
            isError={formik.errors.transmission && formik.touched.transmission}
            errorMessage={formik.errors.transmission}
          />
        </Container>
        <Container>
          <SelectComponent
            label="Cantidad de ruedas del vehículo"
            key="tires"
            name="tires"
            onChange={formik.handleChange}
            value={formik.values.tires?.toString() || ""}
            isError={formik.errors.tires && formik.touched.tires}
            errorMessage={formik.errors.tires}
            onBlur={formik.handleBlur}
            data={[2, 3, 4, 5, 6, 7, 8].map((element) => ({
              key: element.toString(),
              label: element.toString(),
            }))}
          />
        </Container>
        {formik.values.vehicle_images === undefined ||
        formik.values.vehicle_images.length < 1 ? (
          <div className="text-center">
            {formik.errors.vehicle_images && (
              <span className="text-red-500">
                {formik.errors.vehicle_images}
              </span>
            )}
            <FileDropzone
              text="Arrastra las imágenes del vehículo aquí"
              onDrop={(photos) =>
                formik.setFieldValue("vehicle_images", photos)
              }
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="w-auto">
              <ButtonComponent
                color="primary"
                text="Ver imágenes del vehículo"
                type="button"
                variant="light"
                onClick={onShowImagesOpen}
              />
            </div>
            <div>
              <Button
                color="default"
                type="button"
                variant="light"
                className="text-xs"
                onClick={() => formik.setFieldValue("vehicle_images", [])}
              >
                Eliminar imágenes
              </Button>
            </div>
          </div>
        )}
        {props.children}
      </form>
    </>
  );
}

export default VehicleInfoForm;
