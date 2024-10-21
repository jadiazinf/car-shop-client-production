import { useEffect, useState } from "react";
import DatesHelpers from "../../../helpers/dates/helper";
import useGetLocationParents from "../../location/services/get_parents/use_get_parents";
import CompanyModel from "../model";
import PlaceComponent from "../../location/components/place";
import { LocationType } from "../../location/types";
import useGetCompanyCharter from "../services/company_charter/use_get";
import useGetCompanyImages from "../services/company_images/use_get";
import ButtonComponent from "../../../components/buttons/component";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import { FaBuilding } from "react-icons/fa";
import PdfViewer from "../../../components/pdf/pdf_viewer";

function CompanyInfo(props: { company: CompanyModel }) {

  const { isGettingLocationParentsLoading, payloadState: locations, performGetLocationParents } = useGetLocationParents();

  const { payloadState: companyCharter, performGetCompanyCharter } = useGetCompanyCharter();

  const { payloadState: companyImages, performGetCompanyImages } = useGetCompanyImages();

  const { isOpen: isCompanyImagesOpen, onOpenChange: onOpenCompanyImagesChange } = useDisclosure();

  const { isOpen: isCompanyCharterOpen, onOpenChange: onOpenCompanyCharterChange } = useDisclosure();

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


  return (
    <>
      <Modal isOpen={isCompanyImagesOpen} onOpenChange={onOpenCompanyImagesChange} size="4xl" radius="sm">
        <ModalContent>
          <ModalBody className='p-5'>
            <div className='w-full'>
              {
              }
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCompanyCharterOpen} onOpenChange={onOpenCompanyCharterChange} size="4xl" radius="sm">
        <ModalContent>
          <ModalBody>
            <PdfViewer charter={charter as string}/>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div>
        <div className='w-full flex items-center gap-5 mb-5'>
          <FaBuilding className='w-5 h-5'/>
          <span className='font-bold text-2xl font-inter'>Información de taller mecánico</span>
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
            <div className='mt-5 w-full md:w-1/2 pl-3'>
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
              <div className='mt-3'>
                <span>Dirección exacta: <strong>{ props.company.address }</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyInfo;
