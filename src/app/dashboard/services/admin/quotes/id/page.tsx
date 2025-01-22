import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbsContext from "../../../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../../../components/breadcrumbs/header";
import { useQuoteApiServices } from "../../../../../api/quotes";
import { usePersistedStore } from "../../../../../../store/store";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { QuoteInfoForAdminComponent } from "../../../../../../entities/quote/components/info/for_admin";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  QuoteModel,
  QuoteStatus,
} from "../../../../../../entities/quote/model";
import LogoComponent from "../../../../../../components/logo/component";
import ButtonComponent from "../../../../../../components/buttons/component";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";

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
  {
    text: "Cotizaciones",
    url: "/dashboard/services/quotes",
  },
  {
    text: "Información de cotización",
    url: "/dashboard/services/quotes/:id",
  },
];

export default function QuoteInfoPage() {
  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { id } = useParams();

  const { token } = usePersistedStore().authReducer;

  const { getQuoteResponse, isGettingQuote, perform } =
    useQuoteApiServices.getQuote();

  const { isUpdatingQuote, perform: updateQuote } =
    useQuoteApiServices.updateQuote();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const {
    isOpen: isRejectModalOpen,
    onOpenChange: onRejectModalOpenChange,
    onOpen: onRejectModalOpen,
  } = useDisclosure();

  const {
    isOpen: isApproveModalOpen,
    onOpenChange: onApproveModalOpenChange,
    onOpen: onApproveModalOpen,
  } = useDisclosure();

  const [selectedOption, setSelectedOption] = useState<Set<QuoteStatus>>(
    new Set([QuoteStatus.APPROVED])
  );

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
    perform(parseInt(id!), token!);
  }, []);

  function handleSelectionChange(value: unknown) {
    if (value instanceof Set && value.size > 0) {
      const selectedValue = Array.from(value)[0];

      if (
        typeof selectedValue === "string" &&
        Object.values(QuoteStatus).includes(selectedValue as QuoteStatus)
      ) {
        setSelectedOption(new Set([selectedValue as QuoteStatus]));
      } else {
        console.error("Invalid selection");
      }
    } else {
      console.error("Invalid selection or empty Set");
    }
  }

  async function handleUpdateQuote() {
    const response = await updateQuote(
      {
        id: getQuoteResponse!.data!.id,
        status_by_company: Array.from(selectedOption)[0],
      } as QuoteModel,
      token!
    );
    if (response.status === StatusCodes.OK) {
      toasterDispatch({
        payload: "Cotización actualizada correctamente",
        type: "SUCCESS",
      });
      perform(getQuoteResponse!.data!.id!, token!);
    } else {
      toasterDispatch({
        payload:
          response.data?.errors?.[0] || "Cotización no se pudo actualizar",
        type: "ERROR",
      });
    }
  }

  return (
    <>
      <Modal
        radius="sm"
        className="p-5"
        isOpen={isRejectModalOpen}
        onOpenChange={onRejectModalOpenChange}
        size="xl"
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col items-center justify-center">
              <LogoComponent />
              <p className="my-5">¿Está seguro de rechazar esta cotización?</p>
              <div className="flex">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Rechazar cotización"
                    type="button"
                    variant="solid"
                    onClick={handleUpdateQuote}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <Modal
        radius="sm"
        className="p-5"
        isOpen={isApproveModalOpen}
        onOpenChange={onApproveModalOpenChange}
        size="xl"
      >
        <ModalBody>
          <ModalContent>
            <div className="flex flex-col items-center justify-center">
              <LogoComponent />
              <p className="my-5">¿Está seguro de aprobar esta cotización?</p>
              <div className="flex">
                <div className="w-auto">
                  <ButtonComponent
                    color="primary"
                    text="Aprobar cotización"
                    type="button"
                    variant="solid"
                    onClick={handleUpdateQuote}
                  />
                </div>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
      <div className="w-full h-full">
        {!getQuoteResponse || !getQuoteResponse.data ? null : isGettingQuote ? (
          <div className="w-full h-full justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <div className="mt-5">
              <QuoteInfoForAdminComponent
                quote={getQuoteResponse.data}
                refetch={perform}
              />
            </div>
            {getQuoteResponse.data.status_by_company ===
              QuoteStatus.PENDING && (
              <ButtonGroup variant="flat" className="my-5" radius="sm">
                <Button
                  className={
                    Array.from(selectedOption)[0] === QuoteStatus.APPROVED
                      ? "text-white bg-primary"
                      : "text-red-800 border-1.5 border-red-800"
                  }
                  onClick={
                    Array.from(selectedOption)[0] === QuoteStatus.REJECTED
                      ? onRejectModalOpen
                      : onApproveModalOpen
                  }
                  isLoading={isUpdatingQuote}
                >
                  {Array.from(selectedOption)[0] === QuoteStatus.APPROVED
                    ? "Aprobar cotización"
                    : "Rechazar cotización"}
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      className={
                        Array.from(selectedOption)[0] === QuoteStatus.APPROVED
                          ? "text-white bg-primary"
                          : "text-red border-1.5 border-red-800"
                      }
                    >
                      <IoMdArrowDropdown />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectionMode="single"
                    selectedKeys={selectedOption}
                    onSelectionChange={handleSelectionChange}
                    className="max-w-[300px]"
                  >
                    <DropdownItem key={QuoteStatus.APPROVED}>
                      Aprobar cotización
                    </DropdownItem>
                    <DropdownItem key={QuoteStatus.REJECTED}>
                      Rechazar cotización
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            )}
          </div>
        )}
      </div>
    </>
  );
}
