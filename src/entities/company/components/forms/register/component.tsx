import { useFormik } from "formik";
import { ReactNode, useContext, useEffect } from "react";
import TextComponent from "../../../../../components/inputs/text";
import SelectPlace from "../../../../location/components/select_place";
import PlaceContext from "../../../../location/contexts/place";
import CompanyModel from "../../../model";
import CompanyInfoSchema from "./validation_schema";
import FileDropzone from "../../../../../components/dragndrop/component";
import PdfViewer from "../../../../../components/pdf/pdf_viewer";
import ButtonComponent from "../../../../../components/buttons/component";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import ViewImagesComponent from "../../../../../components/images/view_images";

function Container(props: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-5">
      {props.children}
    </div>
  );
}

function CompanyInfoForm(props: {
  initialValues: CompanyModel;
  onSubmit: (values: CompanyModel) => void;
  children?: ReactNode;
  validationSchema?: any;
}) {
  const { place } = useContext(PlaceContext);

  const {
    isOpen: isShowImagesOpen,
    onOpen: onShowImagesOpen,
    onOpenChange: onShowImagesOpenChange,
  } = useDisclosure();

  const {
    isOpen: isShowCharterOpen,
    onOpen: onShowCharterOpen,
    onOpenChange: onShowCharterOpenChange,
  } = useDisclosure();

  function onSubmit(values: CompanyModel) {
    props.onSubmit(values);
  }

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit,
    validationSchema: props.validationSchema || CompanyInfoSchema(),
  });

  useEffect(() => {
    if (place?.town) formik.setFieldValue("location_id", place.town.id);
  }, [place?.town]);

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
                images={formik.values.company_images as File[]}
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isShowCharterOpen}
        onOpenChange={onShowCharterOpenChange}
        size="3xl"
        className="h-1/2"
        radius="sm"
      >
        <ModalBody>
          <ModalContent>
            <div className="py-10 h-full">
              <PdfViewer charter={formik.values.company_charter as File} />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
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
        <div className="flex flex-col gap-2">
          <SelectPlace />
          {formik.errors.location_id && formik.touched.location_id && (
            <span className="text-red-400">{formik.errors.location_id}</span>
          )}
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
        <div className="text-center">
          {formik.errors.company_charter && formik.touched.company_charter && (
            <span className="text-error">{formik.errors.company_charter}</span>
          )}
          {formik.values.company_charter ? (
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Ver acta constitutiva de la compañía"
                  type="button"
                  variant="light"
                  onClick={onShowCharterOpen}
                />
              </div>
              <div>
                <Button
                  color="default"
                  type="button"
                  variant="light"
                  className="text-xs"
                  onClick={() => formik.setFieldValue("company_charter", null)}
                >
                  Eliminar acta constitutiva
                </Button>
              </div>
            </div>
          ) : (
            <FileDropzone
              text="Arrastra el acta constitutiva de la empresa aquí"
              onDrop={(companyCharter) =>
                formik.setFieldValue("company_charter", companyCharter[0])
              }
            />
          )}
        </div>
        <div className="text-center">
          {formik.errors.company_images && formik.touched.company_images && (
            <span className="text-error">{formik.errors.company_images}</span>
          )}
          {formik.values.company_images &&
          formik.values.company_images.length > 0 ? (
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Ver imágenes de la compañía"
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
                  onClick={() => formik.setFieldValue("company_images", [])}
                >
                  Eliminar imágenes
                </Button>
              </div>
            </div>
          ) : (
            <FileDropzone
              text="Arrastra las imágenes de las instalaciones del taller mecánico aquí"
              onDrop={(company_images) =>
                formik.setFieldValue("company_images", company_images)
              }
            />
          )}
        </div>
        <div className="w-full">{props.children}</div>
      </form>
    </>
  );
}

export default CompanyInfoForm;
