import { useContext, useEffect } from "react";
import { usePersistedStore } from "../../../../../../store/store";
import { useCompanyApiServices } from "../../../../../api/companies";
import { Card, CardBody, Spinner } from "@heroui/react";
import CompanyInfoForm from "../../../../../../entities/company/components/forms/register/component";
import CompanyModel from "../../../../../../entities/company/model";
import PlaceProvider from "../../../../../../entities/location/providers/place";
import ButtonComponent from "../../../../../../components/buttons/component";
import useUpdateCompany from "../../../../../../entities/company/services/update/use_update";
import { StatusCodes } from "http-status-codes";
import { ToasterContext } from "../../../../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";

export function CompanyAdminCreateRequest() {
  const { sessionType, token } = usePersistedStore().authReducer;

  const {
    getCompanyResponse,
    isGettingCompany,
    perform: getCompanyInfo,
  } = useCompanyApiServices.getCompany();

  const { isUpdatingCompanyLoading, performUpdateCompany } = useUpdateCompany();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const navigate = useNavigate();

  useEffect(() => {
    getCompanyInfo(sessionType!.company_id!);
  }, []);

  async function onSubmit(values: CompanyModel) {
    const { id, ...company } = values;
    performUpdateCompany(
      {
        company,
        company_id: id!,
        user_id: sessionType!.user!.id!,
        token: token!,
      },
      (data) => {
        if (data.status === StatusCodes.OK) {
          toasterDispatch({
            payload: "Solicitud creada exitosamente",
            type: "SUCCESS",
          });
          navigate("/dashboard/companies");
        } else {
          toasterDispatch({
            payload: data.errorMessage || "Error creando la solicitud",
            type: "ERROR",
          });
        }
      }
    );
  }

  return (
    <div className="w-full h-full">
      {isGettingCompany ? (
        <div className="p-10 w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <PlaceProvider>
          <Card className="p-5 flex justify-center items-center w-full h-full md:w-3/4 lg:w-">
            <CardBody>
              <div className="mb-5">
                <p className="font-bold text-2xl font-inter">
                  Actualización de información de compañía
                </p>
              </div>
              <CompanyInfoForm
                initialValues={
                  (getCompanyResponse?.data as CompanyModel) ||
                  ({} as CompanyModel)
                }
                onSubmit={onSubmit}
                filesAreCommingFrom="server"
              >
                <div className="w-full flex justify-center items-center">
                  <div className="w-auto">
                    <ButtonComponent
                      color="primary"
                      text="Confirmar"
                      type="submit"
                      variant="solid"
                      isLoading={isUpdatingCompanyLoading}
                    />
                  </div>
                </div>
              </CompanyInfoForm>
            </CardBody>
          </Card>
        </PlaceProvider>
      )}
    </div>
  );
}
