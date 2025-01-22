import { useContext, useEffect } from "react";
import useGetLocationParents, {
  GetLocationParentsProps,
} from "../../location/services/get_parents/use_get_parents";
import CompanyModel from "../model";
import { LocationType } from "../../location/types";
import ButtonComponent from "../../../components/buttons/component";
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import PdfViewer from "../../../components/pdf/pdf_viewer";
import AvatarComponent from "../../../components/avatar/component";
import useSetCompanyProfileImage, {
  SetCompanyProfileImageProps,
} from "../services/set_profile_image/use_set_profile_image_service";
import { usePersistedStore } from "../../../store/store";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../components/toaster/context/context";
import ViewImagesComponent from "../../../components/images/view_images";

function CompanyInfo(props: {
  company: CompanyModel;
  imagesAreCommingFrom?: "server" | "client";
  showChangeAvatar?: boolean;
  showCharter?: boolean;
}) {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const {
    isGettingLocationParentsLoading,
    payloadState: locations,
    performGetLocationParents,
  } = useGetLocationParents();

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

  useEffect(() => {
    if (props.company.location_id || props.company.location) {
      const location_id =
        props.company.location_id || props.company.location?.id;
      performGetLocationParents({ location_id: location_id! });
    }
  }, []);

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
        size="2xl"
        radius="sm"
      >
        <ModalBody>
          <ModalContent>
            <div className="py-10">
              <ViewImagesComponent
                isCommingFrom={props.imagesAreCommingFrom || "server"}
                images={props.company.company_images || []}
              />
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={isCompanyCharterOpen}
        onOpenChange={onOpenCompanyCharterChange}
        size="4xl"
        className="h-1/2"
        radius="sm"
      >
        <ModalContent>
          <ModalBody className="p-10">
            <PdfViewer
              charter={
                !props.imagesAreCommingFrom ||
                props.imagesAreCommingFrom === "server"
                  ? import.meta.env.VITE_API_BASE_ROUTE +
                    props.company.company_charter
                  : props.company.company_charter!
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="w-full flex flex-col gap-5">
        {props.showChangeAvatar !== false ? (
          <div className="w-full flex items-center gap-5 mb-5">
            <AvatarComponent
              imgUrl={
                import.meta.env.VITE_API_BASE_ROUTE +
                "/" +
                props.company.profile_image_url
              }
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
            {!props.company.company_charter ||
            props.showCharter === false ? null : (
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
            {!props.company.company_images ? null : (
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
