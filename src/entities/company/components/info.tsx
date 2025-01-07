import { useContext, useEffect, useState } from "react";
import useGetLocationParents, {
  GetLocationParentsProps,
} from "../../location/services/get_parents/use_get_parents";
import CompanyModel from "../model";
import { LocationType } from "../../location/types";
import useGetCompanyCharter from "../services/company_charter/use_get";
import useGetCompanyImages from "../services/company_images/use_get";
import ButtonComponent from "../../../components/buttons/component";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import PdfViewer from "../../../components/pdf/pdf_viewer";
import CarouselComponent from "../../../components/carousel/component";
import AvatarComponent from "../../../components/avatar/component";
import useSetCompanyProfileImage, {
  SetCompanyProfileImageProps,
} from "../services/set_profile_image/use_set_profile_image_service";
import { usePersistedStore } from "../../../store/store";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../components/toaster/context/context";

function CompanyInfo(props: {
  company: CompanyModel;
  showChangeAvatar?: boolean;
}) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const {
    isGettingLocationParentsLoading,
    payloadState: locations,
    performGetLocationParents,
  } = useGetLocationParents();

  const { payloadState: companyCharter, performGetCompanyCharter } =
    useGetCompanyCharter();

  const { payloadState: companyImages, performGetCompanyImages } =
    useGetCompanyImages();

  const {
    isOpen: isCompanyImagesOpen,
    onOpenChange: onOpenCompanyImagesChange,
  } = useDisclosure();

  const {
    isOpen: isCompanyCharterOpen,
    onOpenChange: onOpenCompanyCharterChange,
  } = useDisclosure();

  const { isSettingCompanyProfileImageLoading, performSetCompanyProfileImage } =
    useSetCompanyProfileImage();

  const [images, setImages] = useState<
    Blob[] | File[] | string[] | undefined | null
  >(props.company.company_images);

  const [charter, setCharter] = useState<
    Blob | File | string | undefined | null
  >(props.company.company_charter);

  useEffect(() => {
    if (props.company.location_id || props.company.location) {
      const location_id =
        props.company.location_id || props.company.location?.id;
      performGetLocationParents({ location_id: location_id! });
    }

    if (!props.company.company_charter)
      performGetCompanyCharter({ company_id: props.company.id! });

    if (!props.company.company_images)
      performGetCompanyImages({ company_id: props.company.id! });
  }, []);

  useEffect(() => {
    if (companyCharter !== "not loaded" && companyCharter.payload)
      setCharter(companyCharter.payload);
  }, [companyCharter]);

  useEffect(() => {
    if (companyImages !== "not loaded" && companyImages.payload)
      setImages(companyImages.payload);
  }, [companyImages]);

  function changeAvatar(file: File) {
    performSetCompanyProfileImage(
      { company_id: sessionType!.company_id!, image: file, token: token! },
      (data: SetCompanyProfileImageProps) => {
        if (data.status === StatusCodes.OK) {
          dispatch({
            payload: "Imagen actualizada correctamente",
            type: "SUCCESS",
          });
          window.location.reload();
        } else {
          dispatch({ payload: data.errorMessage!, type: "ERROR" });
        }
      }
    );
  }

  return (
    <>
      <Modal
        isOpen={isCompanyImagesOpen}
        onOpenChange={onOpenCompanyImagesChange}
        size="5xl"
        radius="sm"
      >
        <ModalContent>
          <ModalBody className="p-10">
            <div className="w-full flex justify-center items-center">
              {companyImages !== "not loaded" && companyImages.payload && (
                <CarouselComponent
                  images={companyImages.payload.map((element) => ({
                    src: element,
                  }))}
                />
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isCompanyCharterOpen}
        onOpenChange={onOpenCompanyCharterChange}
        size="4xl"
        radius="sm"
      >
        <ModalContent>
          <ModalBody className="p-10">
            <PdfViewer charter={charter as string} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="w-full flex flex-col gap-5">
        {props.showChangeAvatar !== false ? (
          <div className="w-full flex items-center gap-5 mb-5">
            <AvatarComponent
              imgUrl={props.company.profile_image_url}
              onChangeAvatar={changeAvatar}
              isLoading={isSettingCompanyProfileImageLoading}
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
          <span className="font-bold text-lg mb-3">Información básica</span>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex flex-col w-full">
                <p className="font-light text-sm">Nombre</p>
                <p className="font-medium">{props.company.name}</p>
              </div>
              <div className="flex flex-col w-full">
                <p className="font-light text-sm">RIF Jurídico</p>
                <p className="font-medium">{props.company.dni}</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full">
              <div className="flex flex-col w-full">
                <p className="font-light text-sm">Correo electrónico</p>
                <p className="font-medium">{props.company.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
          <span className="font-bold text-lg mb-3">Dirección</span>
          {locations === "not loaded" &&
          !isGettingLocationParentsLoading ? null : isGettingLocationParentsLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full">
                <div className="flex flex-col w-full">
                  <p className="font-light text-sm">País</p>
                  <p className="font-medium">
                    {
                      (locations as GetLocationParentsProps).payload.find(
                        (location) =>
                          location.location_type === LocationType.COUNTRY
                      )?.name
                    }
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <p className="font-light text-sm">Estado</p>
                  <p className="font-medium">
                    {
                      (locations as GetLocationParentsProps).payload.find(
                        (location) =>
                          location.location_type === LocationType.STATE
                      )?.name
                    }
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <p className="font-light text-sm">Ciudad</p>
                  <p className="font-medium">
                    {
                      (locations as GetLocationParentsProps).payload.find(
                        (location) =>
                          location.location_type === LocationType.CITY
                      )?.name
                    }
                  </p>
                </div>
                <div className="flex flex-col w-full">
                  <p className="font-light text-sm">Municipio</p>
                  <p className="font-medium">
                    {
                      (locations as GetLocationParentsProps).payload.find(
                        (location) =>
                          location.location_type === LocationType.TOWN
                      )?.name
                    }
                  </p>
                </div>
              </div>
              <div>
                <div className="flex flex-col w-full">
                  <p className="font-light text-sm">Dirección exacta</p>
                  <p className="font-medium">{props.company.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 rounded-md p-5 border-1.5 border-black border-opacity-20">
          <span className="font-bold text-lg mb-3">Documentación</span>

          <div className="w-full flex flex-col justify-center items-center md:flex-row md:justify-start md:gap-5">
            {!charter ? null : (
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Ver acta constitutiva"
                  type="button"
                  variant="light"
                  onClick={onOpenCompanyCharterChange}
                />
              </div>
            )}
            {!images ? null : (
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Ver imágenes"
                  type="button"
                  variant="light"
                  onClick={onOpenCompanyImagesChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
