import { IoMdAdd } from "react-icons/io";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import ButtonComponent from "../../../../components/buttons/component";
import TextComponent from "../../../../components/inputs/text";
import { IoSearchOutline } from "react-icons/io5";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import DatatableComponent from "../../../../components/datatable/component";
import { DatatableColumnsProps } from "../../../../components/datatable/types";
import { useContext, useEffect, useState } from "react";
import useDataFromDatatable from "../../../../components/datatable/use_data";
import PaginationComponent from "../../../../components/datatable/pagination";
import useDatatableAction from "../../../../components/datatable/use_action";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import CategoryModel from "../../../../entities/category/model";
import useGetAllCategories from "../../../../entities/category/services/get_all/use_get_all_categories";
import useCreateCategory, { CreateCategoryProps } from "../../../../entities/category/services/create/use_create_category";
import CategoryInfoForm from "../../../../entities/category/forms/info/component";
import { PaginatedData } from "../../../../helpers/application_response/types";
import DatesHelpers from "../../../../helpers/dates/helper";
import useUpdateCategory, { UpdateCategoryProps } from "../../../../entities/category/services/update/use_update_category";
import { usePersistedStore } from "../../../../store/store";
import LogoComponent from "../../../../components/logo/component";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Dashboard",
    url: "/dashboard"
  },
  {
    text: "Categorias de servicios",
    url: "/dashboard/categories"
  }
]

const TABLE_COLUMNS: DatatableColumnsProps[] = [
  {
    key: "name",
    label: "Nombre"
  },
  {
    key: "created_at",
    label: "Fecha de creación"
  },
  {
    key: "actions",
    label: "Acciones"
  }
];

function SuperadminCategoriesPage() {

  const { token, sessionType } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { selectedValues, setSelectedValues } = useDataFromDatatable();

  const { datatableAction, setDatatableAction } = useDatatableAction();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const [ page, setPage ] = useState<number>(1);

  const { isGettingAllCategoriesLoading, payloadState, performGetAllCategories } = useGetAllCategories();

  const {
    isOpen: isCreateNewCategoryFormOpen,
    onOpenChange: onCreateNewCategoryFormOpenChange,
    onOpen: onCreateNewCategoryFormOpen,
    onClose: onCreateNewCategoryFormClose
  } = useDisclosure();

  const { isCreatingCategoryLoading, payloadState: createCategoryState, performCreateCategory } = useCreateCategory();

  const {
    isOpen: isUpdateCategoryFormOpen,
    onOpenChange: onUpdateCategoryFormOpenChange,
    onOpen: onUpdateCategoryFormOpen,
    onClose: onUpdateCategoryFormClose
  } = useDisclosure();

  const { isUpdatingCategoryLoading, performUpdateCategory } = useUpdateCategory();

  const {
    isOpen: isDeleteCategoryOpen,
    onOpenChange: onDeleteCategoryOpenChange,
    onOpen: onDeleteCategoryOpen,
    onClose: onDeleteCategoryClose
  } = useDisclosure();

  const { isUpdatingCategoryLoading: isDeletingCategoryLoading, performUpdateCategory: performDeleteCategory } = useUpdateCategory();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  useEffect(() => {
    performGetAllCategories({page});
  }, [page]);


  useEffect(() => {
    if (createCategoryState !== 'not loaded') {
      if (createCategoryState.status === StatusCodes.CREATED)  {
        toasterDispatch({payload: 'Creación de categoria exitoso', type: 'SUCCESS'});
        performGetAllCategories({page});
        setPage(1);
      } else {
        toasterDispatch({payload: createCategoryState.errorMessage || 'No se pudo crear la nueva categoria', type: 'ERROR'});
      }
    }
  }, [createCategoryState]);

  useEffect(() => {
    if (datatableAction.action === 'update')
      onUpdateCategoryFormOpen();
    if (datatableAction.action === 'delete')
      onDeleteCategoryOpen();
  }, [datatableAction]);

  function controlCreateCategoryResponse(data: CreateCategoryProps) {
    if (data.status === StatusCodes.CREATED)
      onCreateNewCategoryFormClose();
  }

  function handleCreateNewCategory(values: CategoryModel) {
    performCreateCategory({category: values, token: token!, company_id: sessionType?.company_id!}, controlCreateCategoryResponse);
  }

  function controlUpdateCategoryResponse(data: UpdateCategoryProps) {
    if (data.status === StatusCodes.OK) {
      onUpdateCategoryFormClose();
      toasterDispatch({payload: "Categoria actualizada correctamente", type: "SUCCESS"});
      setPage(1);
      return;
    }

    toasterDispatch({payload: "No se pudo actualizar la categoria", type: "ERROR"});
  }

  function handleUpdateNewCategory(values: CategoryModel) {
    performUpdateCategory({category: values, company_id: sessionType?.company_id!, token: token!}, controlUpdateCategoryResponse);
  }

  function controlDeleteCategoryResponse(data: UpdateCategoryProps) {
    if (data.status === StatusCodes.OK) {
      onDeleteCategoryClose();
      toasterDispatch({payload: "Categoria eliminada correctamente", type: "SUCCESS"});
      setPage(1);
      return;
    }

    toasterDispatch({payload: "No se pudo eliminar la categoria", type: "ERROR"});
  }

  function handleDeleteCategory() {
    performDeleteCategory({
      category: {id: datatableAction.id!, is_active: false} as CategoryModel,
      company_id: sessionType?.company_id!,
      token: token!
    },
      controlDeleteCategoryResponse
    );
  }

  return (
    <>
      <Modal
        isOpen={isCreateNewCategoryFormOpen}
        onOpenChange={onCreateNewCategoryFormOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody className="flex flex-col">
            <span className="font-bold text-2xl font-inter">Formulario de nueva categoria</span>
            <CategoryInfoForm
              onSubmit={handleCreateNewCategory}
            >
              <ButtonComponent
                color="primary"
                text="Confirmar"
                type="submit"
                variant="solid"
                isLoading={isCreatingCategoryLoading}
              />
            </CategoryInfoForm>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isUpdateCategoryFormOpen}
        onOpenChange={onUpdateCategoryFormOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            {
              payloadState === "not loaded" ? null :
              !datatableAction.id ? <span>Seleccione una categoria para edición</span> :
                <div className="flex flex-col gap-5">
                  <span className="font-bold text-2xl font-inter">Formulario de edición de categoria</span>
                  <CategoryInfoForm
                    onSubmit={handleUpdateNewCategory}
                    initialValues={(payloadState.payload as PaginatedData<CategoryModel>).data.find( element => element.id === datatableAction.id )!}
                  >
                    <ButtonComponent
                      color="primary"
                      text="Confirmar"
                      type="submit"
                      variant="solid"
                      isLoading={isUpdatingCategoryLoading}
                    />
                  </CategoryInfoForm>
                </div>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteCategoryOpen}
        onOpenChange={onDeleteCategoryOpenChange}
        radius="sm"
        size="3xl"
        backdrop="opaque"
        className="p-10"
        isDismissable={false}
      >
        <ModalContent>
          <ModalBody>
            {
              payloadState === "not loaded" ? null :
              !datatableAction.id ? <span>Seleccione una categoria para eliminar</span> :
                <div className="flex flex-col justify-center items-center gap-5">
                  <LogoComponent />
                  <span className="font-inter">Está seguro de eliminar la categoria <strong>{(payloadState.payload as PaginatedData<CategoryModel>).data.find( element => element.id === datatableAction.id )!.name}</strong>?</span>
                  <ButtonComponent
                    color="primary"
                    text="Confirmar"
                    type="button"
                    onClick={handleDeleteCategory}
                    variant="solid"
                    isLoading={isDeletingCategoryLoading}
                  />
                </div>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className='w-full flex flex-col'>
        <div className="w-full flex justify-between items-center m-auto">
          <span className="text-3xl font-bold font-inter">Categoria de servicios</span>
          <div className='w-auto flex items-center gap-5'>
            <TextComponent
              name="name"
              onChange={() => {}}
              type="text"
              value=""
              placeholder="Buscar por nombre"
              variant="bordered"
              endContent={<IoSearchOutline />}
            />
            <div className="w-auto">
              <ButtonComponent
                color="primary"
                text="Crear nueva categoria"
                type="button"
                variant="solid"
                onClick={onCreateNewCategoryFormOpen}
                startContent={<IoMdAdd className='w-5 h-5'/>}
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <DatatableComponent
            columns={TABLE_COLUMNS}
            data={payloadState === 'not loaded' ? [] : (payloadState.payload as PaginatedData<CategoryModel>).data.map( element => ({id: element.id, name: element.name, created_at: DatesHelpers.formatFullDate(element.created_at!)}) ) || []}
            selectedData={selectedValues}
            setSelectedData={setSelectedValues}
            selectionMode="multiple"
            actionState={datatableAction}
            setActionState={setDatatableAction}
            isLoading={isGettingAllCategoriesLoading}
            noContentMessage="No hay servicios registrados"
            isRowDataEditable
            isRowDataDeletable
          />
          {
            payloadState === 'not loaded' ? null :
            <div className="w-full flex justify-end mt-5">
              <PaginationComponent
                page={page}
                pages={(payloadState.payload as PaginatedData<CategoryModel>).total_pages}
                setPage={setPage}
              />
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default SuperadminCategoriesPage;
