import { useContext, useEffect, useState } from "react";
import DatesHelpers from "../../../helpers/dates/helper";
import useGetLocationParents from "../../location/services/get_parents/use_get_parents";
import CompanyModel from "../model";
import PlaceComponent from "../../location/components/place";
import { LocationType } from "../../location/types";
import useGetCompanyCharter from "../services/company_charter/use_get";
import useGetCompanyImages from "../services/company_images/use_get";
import ButtonComponent from "../../../components/buttons/component";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import PdfViewer from "../../../components/pdf/pdf_viewer";
import CarouselComponent from "../../../components/carousel/component";
import AvatarComponent from "../../../components/avatar/component";
import useSetCompanyProfileImage, { SetCompanyProfileImageProps } from "../services/set_profile_image/use_set_profile_image_service";
import { usePersistedStore } from "../../../store/store";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../components/toaster/context/context";

function CompanyInfo(props: { company: CompanyModel }) {

  const { sessionType, token } = usePersistedStore().authReducer;

  const { dispatch } = useContext(ToasterContext);

  const { isGettingLocationParentsLoading, payloadState: locations, performGetLocationParents } = useGetLocationParents();

  const { payloadState: companyCharter, performGetCompanyCharter } = useGetCompanyCharter();

  const { payloadState: companyImages, performGetCompanyImages } = useGetCompanyImages();

  const { isOpen: isCompanyImagesOpen, onOpenChange: onOpenCompanyImagesChange } = useDisclosure();

  const { isOpen: isCompanyCharterOpen, onOpenChange: onOpenCompanyCharterChange } = useDisclosure();

  const { isSettingCompanyProfileImageLoading, performSetCompanyProfileImage } = useSetCompanyProfileImage();

  const [ images, setImages ] = useState<Blob[] | File[] | string[] | undefined>(props.company.company_images);

  const [ charter, setCharter ] = useState<Blob | File | string | undefined>(props.company.company_charter);

  useEffect(() => {
    if (props.company.location_id || props.company.location) {
      const location_id = props.company.location_id || props.company.location?.id;
      performGetLocationParents({location_id: location_id!});
    }

    if (!props.company.company_charter)
      performGetCompanyCharter({company_id: props.company.id!});

    if (!props.company.company_images)
      performGetCompanyImages({company_id: props.company.id!});

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
    performSetCompanyProfileImage({company_id: sessionType!.company_id!, image: file, token: token!}, (data: SetCompanyProfileImageProps) => {
      if (data.status === StatusCodes.OK) {
        dispatch({payload: "Imagen actualizada correctamente", type: "SUCCESS"});
        window.location.reload();
      } else {
        dispatch({payload: data.errorMessage!, type: "ERROR"});
      }
    });
  }

   return (
    <>
      <Modal isOpen={isCompanyImagesOpen} onOpenChange={onOpenCompanyImagesChange} size='5xl' radius="sm">
        <ModalContent>
          <ModalBody className='p-10'>
            <div className='w-full flex justify-center items-center'>
              {
                companyImages !== "not loaded" && companyImages.payload &&
                <CarouselComponent images={companyImages.payload.map( element => ({src: element}) )}/>
              }
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCompanyCharterOpen} onOpenChange={onOpenCompanyCharterChange} size="4xl" radius="sm">
        <ModalContent>
          <ModalBody className='p-10'>
            <PdfViewer charter={charter as string}/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className='w-full flex flex-col justify-center px-2'>
        <div className='w-full flex items-center gap-5 mb-5'>
          <AvatarComponent
            imgUrl={props.company.profile_image_url}
            onChangeAvatar={changeAvatar}
            isLoading={isSettingCompanyProfileImageLoading}
          />
        </div>
        <div className='flex flex-col lg:flex-row gap-5'>
          <div className='w-full flex flex-col gap-3'>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-2'>
                <span className='font-bold'>Información básica</span>
                <div className='flex flex-col pl-3'>
                  <span>Nombre: <strong>{ props.company.name }</strong></span>
                  {
                    props.company.created_at && <span>Fecha de creación: <strong>{ DatesHelpers.formatFullDate(props.company.created_at) }</strong></span>
                  }
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='font-bold'>Contacto</span>
                <div className='pl-3'>
                  <span>Correo electrónico: <strong>{ props.company.email }</strong></span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='font-bold'>Documentación</span>
                <div className='pl-3'>
                  <span>RIF: <strong>{ props.company.dni }</strong></span>
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center md:flex-row md:justify-start md:gap-5'>
              {
                !charter ? null :
                <div className='w-52'>
                  <ButtonComponent
                    color="primary"
                    text="Ver acta constitutiva"
                    type="button"
                    variant="light"
                    onClick={onOpenCompanyCharterChange}
                  />
                </div>
              }
              {
                !images ? null :
                <div className='w-52'>
                  <ButtonComponent
                    color="primary"
                    text="Ver imágenes"
                    type="button"
                    variant="light"
                    onClick={onOpenCompanyImagesChange}
                  />
                </div>
              }
            </div>
          </div>
          <div className='w-full flex flex-col lg:items-end gap-2'>
            <span className='font-bold'>Ubicación</span>
              {
                locations !== 'not loaded' && !isGettingLocationParentsLoading &&
                <PlaceComponent
                  direction="vertical"
                  country={locations.payload.find( location => location.location_type === LocationType.COUNTRY )!}
                  state={locations.payload.find( location => location.location_type === LocationType.STATE )!}
                  city={locations.payload.find( location => location.location_type === LocationType.CITY )!}
                  town={locations.payload.find( location => location.location_type === LocationType.TOWN )!}
                />
              }
              <span>Dirección exacta: <strong>{ props.company.address }</strong></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
