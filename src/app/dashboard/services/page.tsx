import { IoMdAdd } from "react-icons/io";
import { HeaderBreadcrumbItemProps } from "../../../components/breadcrumbs/header";
import ButtonComponent from "../../../components/buttons/component";
import { IoSearchOutline } from "react-icons/io5";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import DatatableComponent from "../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../components/datatable/types";
import { useContext, useEffect, useState } from "react";
import useDataFromDatatable from "../../../components/datatable/use_data";
import PaginationComponent from "../../../components/datatable/pagination";
import useDatatableAction from "../../../components/datatable/use_action";
import { ToasterContext } from "../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { usePersistedStore } from "../../../store/store";
import LogoComponent from "../../../components/logo/component";
import useCreateServiceService, {
  CreateServiceProps,
} from "../../../entities/service/services/create/use_create_service";
import useUpdateServiceService, {
  UpdateServiceProps,
} from "../../../entities/service/services/update/use_update_service";
import ServiceModel from "../../../entities/service/model";
import ServiceInfoForm from "../../../entities/service/forms/info/component";
import BreadcrumbsContext from "../../../components/breadcrumbs/context";
import ServicePricesComponent from "../../../entities/service/components/prices/component";
import { useCompanyApiServices } from "../../api/companies";
import { UserCompanyRole } from "../../../entities/users_companies/types";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    text: "Servicios del taller",
    url: "/dashboard/services",
  },
];

const TABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "description",
    label: "Descripción",
  },
  {
    key: "category",
    label: "Categoría",
  },
  {
    key: "prices",
    label: "Precios expresados en REF",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

function AdminServicesPage() {
  const { authReducer } = usePersistedStore();

  const { token, sessionType } = authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { selectedValues, setSelectedValues } = useDataFromDatatable();

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const [page, setPage] = useState<number>(1);

  const { getCompanyServicesResponse, isGettingCompanyServices, perform } =
    useCompanyApiServices.getCompanyServices();

  const {
    isOpen: isCreateNewServiceFormOpen,
    onOpenChange: onCreateNewServiceFormOpenChange,
    onOpen: onCreateNewServiceFormOpen,
    onClose: onCreateNewServiceFormClose,
  } = useDisclosure();

  const {
    isCreatingService,
    payloadState: createServiceState,
    performCreateService,
  } = useCreateServiceService();

  const {
    isOpen: isUpdateServiceFormOpen,
    onOpenChange: onUpdateServiceFormOpenChange,
    onOpen: onUpdateServiceFormOpen,
    onClose: onUpdateServiceFormClose,
  } = useDisclosure();

  const { isUpdatingService, performUpdateService } = useUpdateServiceService();

  const {
    isOpen: isDeleteServiceOpen,
    onOpenChange: onDeleteServiceOpenChange,
    onOpen: onDeleteServiceOpen,
    onClose: onDeleteServiceClose,
  } = useDisclosure();

  const {
    isUpdatingService: isDeletingServiceLoading,
    performUpdateService: performDeleteService,
  } = useUpdateServiceService();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    perform(sessionType!.company_id!, page);
  }, [page]);

  useEffect(() => {
    if (createServiceState !== "not loaded") {
      if (createServiceState.status === StatusCodes.CREATED) {
        toasterDispatch({
          payload: "Creación de servicio exitoso",
          type: "SUCCESS",
        });
        perform(sessionType!.company_id!, page);
      } else {
        toasterDispatch({
          payload:
            createServiceState.errorMessage ||
            "No se pudo crear el nuevo servicio",
          type: "ERROR",
        });
      }
    }
  }, [createServiceState]);

  useEffect(() => {
    if (datatableAction.action === "update") onUpdateServiceFormOpen();
    if (datatableAction.action === "delete") onDeleteServiceOpen();
  }, [datatableAction]);

  function controlCreateServiceResponse(data: CreateServiceProps) {
    if (data.status === StatusCodes.CREATED) {
      onCreateNewServiceFormClose();
      setPage(1);
    }
  }

  function handleCreateNewService(values: ServiceModel) {
    performCreateService(
      { service: values, token: token!, company_id: sessionType?.company_id! },
      controlCreateServiceResponse
    );
  }

  function controlUpdateServiceResponse(data: UpdateServiceProps) {
    if (data.status === StatusCodes.OK) {
      onUpdateServiceFormClose();
      toasterDispatch({
        payload: "Servicio actualizado correctamente",
        type: "SUCCESS",
      });
      setPage(1);
      return;
    } else {
      toasterDispatch({ payload: data.errorMessage!, type: "ERROR" });
    }

    toasterDispatch({
      payload: "No se pudo actualizar el servicio",
      type: "ERROR",
    });
  }

  function handleUpdateService(values: ServiceModel) {
    performUpdateService(
      { service: values, company_id: sessionType?.company_id!, token: token! },
      controlUpdateServiceResponse
    );
  }

  function controlDeleteServiceResponse(data: UpdateServiceProps) {
    if (data.status === StatusCodes.OK) {
      onDeleteServiceClose();
      toasterDispatch({
        payload: "Servicio eliminado correctamente",
        type: "SUCCESS",
      });
      setPage(1);
      return;
    } else {
      toasterDispatch({ payload: data.errorMessage!, type: "ERROR" });
    }

    toasterDispatch({
      payload: "No se pudo eliminar el servicio",
      type: "ERROR",
    });
  }

  function handleDeleteService() {
    performDeleteService(
      {
        service: { id: datatableAction.id!, is_active: false } as ServiceModel,
        company_id: sessionType?.company_id!,
        token: token!,
      },
      controlDeleteServiceResponse
    );
  }

  return (
    <div className="w-full">
      <Modal
        isOpen={isCreateNewServiceFormOpen}
        onOpenChange={onCreateNewServiceFormOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody className="flex flex-col">
            <span className="font-bold text-2xl font-inter">
              Formulario de nuevo servicio
            </span>
            <ServiceInfoForm onSubmit={handleCreateNewService}>
              <ButtonComponent
                color="primary"
                text="Confirmar"
                type="submit"
                variant="solid"
                isLoading={isCreatingService}
              />
            </ServiceInfoForm>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUpdateServiceFormOpen}
        onOpenChange={onUpdateServiceFormOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            {!getCompanyServicesResponse ||
            !getCompanyServicesResponse.data ? null : !datatableAction.id ? (
              <span>Seleccione un servicio para modificación</span>
            ) : (
              <div className="flex flex-col gap-5">
                <span className="font-bold text-2xl font-inter">
                  Formulario de modificación de servicio
                </span>
                <ServiceInfoForm
                  onSubmit={handleUpdateService}
                  initialValues={
                    getCompanyServicesResponse.data.data.find(
                      (element) => element.id === datatableAction.id
                    )!
                  }
                  requiredFields={false}
                >
                  <ButtonComponent
                    color="primary"
                    text="Confirmar"
                    type="submit"
                    variant="solid"
                    isLoading={isUpdatingService}
                  />
                </ServiceInfoForm>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteServiceOpen}
        onOpenChange={onDeleteServiceOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            {!getCompanyServicesResponse ||
            !getCompanyServicesResponse.data ? null : !datatableAction.id ? (
              <span>Seleccione una categoría para eliminar</span>
            ) : (
              <div className="flex flex-col justify-center items-center gap-5">
                <LogoComponent />
                <span className="font-inter">
                  Está seguro de eliminar la categoría{" "}
                  <strong>
                    {
                      getCompanyServicesResponse.data.data.find(
                        (element) => element.id === datatableAction.id
                      )!.name
                    }
                  </strong>
                  ?
                </span>
                <ButtonComponent
                  color="primary"
                  text="Confirmar"
                  type="button"
                  onClick={handleDeleteService}
                  variant="solid"
                  isLoading={isDeletingServiceLoading}
                />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="flex flex-col">
        <div className="w-full flex justify-between items-center m-auto">
          <p className="w-full font-inter font-semibold text-2xl">
            Servicios de la empresa
          </p>
          <div className="w-full flex items-center justify-end gap-5">
            <Input
              className="w-96"
              size="lg"
              name="name"
              onChange={() => {}}
              type="text"
              value=""
              placeholder="Buscar por nombre"
              variant="bordered"
              startContent={<IoSearchOutline />}
              radius="sm"
            />
            {sessionType?.roles?.some(role => role === UserCompanyRole.ADMIN || role === UserCompanyRole.SUPERVISOR) && (
              <Button
                color="primary"
                type="button"
                size="lg"
                variant="solid"
                radius="sm"
                onPress={onCreateNewServiceFormOpen}
                startContent={<IoMdAdd className="w-5 h-5" />}
              >
                Crear nuevo servicio
              </Button>
            )}
          </div>
        </div>
        <div className="mt-5">
          <DatatableComponent
            columns={TABLE_COLUMNS}
            data={
              !getCompanyServicesResponse || !getCompanyServicesResponse.data
                ? []
                : getCompanyServicesResponse.data.data.map((element) => ({
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    category: element.category!.name,
                    prices: <ServicePricesComponent service={element} />,
                  })) || []
            }
            selectedData={selectedValues}
            setSelectedData={setSelectedValues}
            selectionMode="multiple"
            actionState={datatableAction}
            setActionState={setDatatableAction}
            isLoading={isGettingCompanyServices}
            noContentMessage="No hay servicios registrados"
            isRowDataEditable
            isRowDataDeletable
          />
          {!getCompanyServicesResponse ||
          !getCompanyServicesResponse.data ? null : (
            <div className="w-full flex justify-end mt-5">
              <PaginationComponent
                page={page}
                pages={getCompanyServicesResponse.data.total_pages}
                setPage={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminServicesPage;
