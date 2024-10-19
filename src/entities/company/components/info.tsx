import { useEffect } from "react";
import DatesHelpers from "../../../helpers/dates/helper";
import useGetLocationParents from "../../location/services/get_parents/use_get_parents";
import CompanyModel from "../model";
import PlaceComponent from "../../location/components/place";
import { LocationType } from "../../location/types";
import useGetCompanyCharter from "../services/company_charter/use_get";
import useGetCompanyImages from "../services/company_images/use_get";
import ButtonComponent from "../../../components/buttons/component";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";

function CompanyInfo(props: { company: CompanyModel }) {

  const { isGettingLocationParentsLoading, payloadState: locations, performGetLocationParents } = useGetLocationParents();

  const { payloadState: companyCharter, performGetCompanyCharter } = useGetCompanyCharter();

  const { payloadState: companyImages, performGetCompanyImages } = useGetCompanyImages();

  const { isOpen: isCompanyImagesOpen, onOpenChange: onOpenCompanyImagesChange } = useDisclosure();

  const { isOpen: isCompanyCharterOpen, onOpenChange: onOpenCompanyCharterChange } = useDisclosure();

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

  return (
    <>
      <Modal isOpen={isCompanyImagesOpen} onOpenChange={onOpenCompanyImagesChange} size="4xl" radius="sm">
        <ModalContent>
          <ModalBody className='p-5'>
            <span>Imagenes</span>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCompanyCharterOpen} onOpenChange={onOpenCompanyCharterChange} size="4xl" radius="sm">
        <ModalContent>
          <ModalBody>
            <span>Acta constitutiva</span>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className='w-full flex flex-col gap-3 border-1.5 rounded-md border-black border-opacity-10 p-5'>
        <div className='w-full text-center'>
          <span className='font-bold text-2xl font-inter'>Información de taller mecánico</span>
        </div>
        <span>Nombre: <strong>{ props.company.name }</strong></span>
        <span>RIF: <strong>{ props.company.dni }</strong></span>
        <span>Correo electrónico: <strong>{ props.company.email }</strong></span>
        {
          props.company.created_at && <span>Fecha de creación: <strong>{ DatesHelpers.formatFullDate(props.company.created_at) }</strong></span>
        }
        <span>Dirección exacta: <strong>{ props.company.address }</strong></span>
        {
          locations !== 'not loaded' && !isGettingLocationParentsLoading &&
          <PlaceComponent
            country={locations.payload.find( location => location.location_type === LocationType.COUNTRY )!}
            state={locations.payload.find( location => location.location_type === LocationType.STATE )!}
            city={locations.payload.find( location => location.location_type === LocationType.CITY )!}
            town={locations.payload.find( location => location.location_type === LocationType.TOWN )!}
          />
        }
        <div className='w-full flex justify-center md:justify-end'>
          {
            !props.company.company_charter && (companyCharter === 'not loaded' || !companyCharter.payload) ? null :
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
            !props.company.company_images && (companyImages === 'not loaded' || !companyImages.payload) ? null :
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
    </>
  );
}

export default CompanyInfo;
