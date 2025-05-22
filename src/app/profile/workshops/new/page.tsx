import { useContext, useEffect } from "react";
import BreadcrumbsContext from "../../../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../../../components/breadcrumbs/header";
import { usePersistedStore } from "../../../../store/store";
import CompanyModel from "../../../../entities/company/model";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../components/toaster/context/context";
import { useCompanyApiServices } from "../../../api/companies";
import CompanyInfoForm from "../../../../entities/company/components/forms/register/component";
import ButtonComponent from "../../../../components/buttons/component";
import { useNavigate } from "react-router-dom";
import PlaceProvider from "../../../../entities/location/providers/place";
import { Card, CardBody } from "@heroui/react";

const HEADER_BREADCRUMBS: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Perfil",
    url: "/profile",
  },
  {
    text: "Mis compañías",
    url: "/profile/workshops",
  },
  {
    text: "Registrar nueva compañía",
    url: "/profile/workshops/new",
  },
];

export default function ProfileNewWorkshopPage() {
  return (
    <PlaceProvider>
      <Main />
    </PlaceProvider>
  );
}

function Main() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { isCreatingCompany, perform: createCompany } =
      useCompanyApiServices.createCompany();

  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbs(HEADER_BREADCRUMBS);
  }, []);

  async function handleRegisterCompany(company: CompanyModel) {
    const companyResponse = await createCompany(company, sessionType!.user.id!, token!);

    if (companyResponse.status !== StatusCodes.CREATED) {
      toasterDispatch({
        payload: (companyResponse.data as { errors: string[] }).errors
          ? (companyResponse.data as { errors: string[] }).errors[0]
          : "Error al registrar compañía",
        type: "ERROR",
      });
    }

    toasterDispatch({
      payload: "Compañía registrada con éxito",
      type: "SUCCESS",
    });

    navigate("/profile/workshops");
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="p-5" radius="sm">
        <CardBody>
          <div>
            <span className="font-inter font-bold text-2xl">
              Formulario de registro de taller
            </span>
            <div className="hidden md:block md:w-1/6 bg-blue-600 h-1"></div>
          </div>
          <CompanyInfoForm
            initialValues={{} as CompanyModel}
            onSubmit={(values) => handleRegisterCompany(values)}
          >
            <div className="w-full flex justify-end items-center">
              <div className="w-auto">
                <ButtonComponent
                  color="primary"
                  text="Registrar"
                  type="submit"
                  variant="solid"
                  isLoading={isCreatingCompany}
                />
              </div>
            </div>
          </CompanyInfoForm>
        </CardBody>
      </Card>
    </div>
  );
}
