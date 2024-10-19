import { useParams } from "react-router-dom";
import useGetUserCompanyRequest from "../../../../../entities/user_company_request/services/get/use_get_request";
import { BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, Spinner, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import CompanyInfo from "../../../../../entities/company/components/info";
import UserInfo from "../../../../../entities/user/components/info";
import { UserCompanyRequestStatus } from "../../../../../entities/user_company_request/types";
import { IoMdArrowDropdown } from "react-icons/io";
import UserCompanyRequestHelper from "../../../../../entities/user_company_request/helper";
import TextComponent from "../../../../../components/inputs/text";
import ButtonComponent from "../../../../../components/buttons/component";
import LogoComponent from "../../../../../components/logo/component";

function CompanyRequestPage() {
  const params = useParams();

  const { isGettingUserCompanyRequestLoading, payloadState: request, performGetUserCompanyRequest } = useGetUserCompanyRequest();

  const [ selectedOption, setSelectedOption ] = useState<Set<UserCompanyRequestStatus>>(new Set([UserCompanyRequestStatus.APPROVED]));

  const [ selectedStatus, setSelectedStatus ] = useState<UserCompanyRequestStatus>(UserCompanyRequestStatus.APPROVED);

  const { isOpen: isRejectionOpen, onOpenChange: onOpenRejectionChange } = useDisclosure();

  const { isOpen: isApprovedOpen, onOpenChange: onOpenApprovedChange } = useDisclosure();

  const [ rejectionMessage, setRejectionMessage ] = useState<{message: string}>({message: ''});

  useEffect(() => {
    if (request === 'not loaded')
      performGetUserCompanyRequest({request_id: parseInt(params.id!)});
  }, []);

  useEffect(() => {
    setSelectedStatus(Array.from(selectedOption)[0] as UserCompanyRequestStatus);
  }, [selectedOption]);

  const handleSelectionChange = (value: unknown) => {
    if (value instanceof Set && value.size > 0) {
      const selectedValue = Array.from(value)[0];

      if (typeof selectedValue === 'string' && Object.values(UserCompanyRequestStatus).includes(selectedValue as UserCompanyRequestStatus)) {
        setSelectedOption(new Set([selectedValue as UserCompanyRequestStatus]));
      } else {
        console.error('Invalid selection');
      }
    } else {
      console.error('Invalid selection or empty Set');
    }
  };

  function handleSubmit() {
    console.log(selectedStatus);
  }

  return (
    <>
      <Modal isOpen={isRejectionOpen} onOpenChange={onOpenRejectionChange} size="2xl" radius="sm">
        <ModalContent>
          <ModalBody className='p-10'>
            <div className='w-auto flex flex-col gap-5 justify-center items-center'>
              <LogoComponent size="4xl"/>
              <TextComponent
                key="rejection"
                name="message"
                onChange={(e) => setRejectionMessage({message: e.target.value})}
                type="text"
                value={rejectionMessage.message}
                label="Mensaje de rechazo"
              />
              <div className='w-auto'>
                <ButtonComponent
                  color="primary"
                  text="Aceptar"
                  type="button"
                  variant="solid"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isApprovedOpen} onOpenChange={onOpenApprovedChange} size="2xl" radius="sm">
        <ModalContent>
          <ModalBody className='p-10'>
            <div className='w-auto flex flex-col gap-5 justify-center items-center'>
              <LogoComponent size="4xl"/>
              <strong>¿Está seguro de aprobar esta petición?</strong>
              <div className='w-auto'>
                <ButtonComponent
                  color="primary"
                  text="Aceptar"
                  type="button"
                  variant="solid"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className='w-full h-full p-10 flex justify-center items-center flex-col'>
        <div className='w-full flex justify-between items-center'>
          <Breadcrumbs underline="hover" color="foreground">
            <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
            <BreadcrumbItem href="/dashboard/companies">Compañías</BreadcrumbItem>
            <BreadcrumbItem href="/dashbpard/companies/requests">Peticiones</BreadcrumbItem>
            <BreadcrumbItem href={`/dashbpard/companies/requests/${params.id}`}>Petición</BreadcrumbItem>
          </Breadcrumbs>
          <ButtonGroup variant="flat">
            <Button
              className={selectedStatus === UserCompanyRequestStatus.APPROVED ? 'text-white bg-green-800' : 'text-white bg-red-800'}
              onClick={selectedStatus === UserCompanyRequestStatus.REJECTED ? onOpenRejectionChange : onOpenApprovedChange}
            >
              {`${UserCompanyRequestHelper.translateStatusOnAction(Array.from(selectedOption)[0])} solicitud`}
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  className={selectedStatus === UserCompanyRequestStatus.APPROVED ? 'text-white bg-green-800' : 'text-white bg-red-800'}
                >
                  <IoMdArrowDropdown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Merge options"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={handleSelectionChange}
                className="max-w-[300px]"
              >
                <DropdownItem key="approved" description="Al aprobar, la compañía podrá ofrecer sus servicios en la plataforma">
                  Aprobar solicitud
                </DropdownItem>
                <DropdownItem key="rejected" description="Al rechazar, la compañía no podrá ofrecer sus servicios en la plataforma, pero el usuario podrá volver a crear otra solicitud de registro">
                  Rechazar solicitud
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </div>
        <div className='w-full h-full flex justify-center items-center my-10'>
          {
            isGettingUserCompanyRequestLoading || request === 'not loaded' ? <Spinner /> :
            <div className='w-full h-full flex flex-col gap-10'>
              <UserInfo user={request.payload.user!}/>
              <CompanyInfo company={request.payload.company!}/>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default CompanyRequestPage;
