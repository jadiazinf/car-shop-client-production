import AdminUpdateRequestLayout from "./layout";
import { useContext, useEffect } from "react";
import { Card, CardBody, Divider, Spinner } from "@nextui-org/react";
import CompanyInfoForm from "../../../../../../../entities/company/components/forms/register/component";
import CompanyModel from "../../../../../../../entities/company/model";
import useGetCompany from "../../../../../../../entities/company/services/get/use_get_company";
import { usePersistedStore } from "../../../../../../../store/store";
import CompanyInfoSchema from "../../../../../../../entities/company/components/forms/register/validation_schema";
import ButtonComponent from "../../../../../../../components/buttons/component";
import PlaceContext from "../../../../../../../entities/location/contexts/place";
import useGetLocationParents from "../../../../../../../entities/location/services/get_parents/use_get_parents";
import useGetCompanyCharter from "../../../../../../../entities/company/services/company_charter/use_get";
import useGetCompanyImages from "../../../../../../../entities/company/services/company_images/use_get";
import { LocationType } from "../../../../../../../entities/location/types";
import useUpdateCompany from "../../../../../../../entities/company/services/update/use_update";
import { ToasterContext } from "../../../../../../../components/toaster/context/context";
import { useNavigate } from "react-router-dom";

function Main() {

  const { setPlace } = useContext(PlaceContext);

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  const { authReducer } = usePersistedStore();

  const navigate = useNavigate();

  const { sessionType, token } = authReducer;

  const { isGettingCompanyLoading, payloadState: companyPayload, performGetCompany } = useGetCompany();

  const { isGettingLocationParentsLoading, payloadState: locationParentsPayload, performGetLocationParents } = useGetLocationParents();

  const { payloadState: companyCharterPayload, performGetCompanyCharter } = useGetCompanyCharter();

  const { payloadState: companyImagesPayload, performGetCompanyImages } = useGetCompanyImages();

  const { isUpdatingCompanyLoading, payloadState: updateCompany, performUpdateCompany } = useUpdateCompany();

  useEffect(() => {
    performGetCompany({company_id: sessionType!.company_id!, token: token!});
    performGetCompanyCharter({company_id: sessionType!.company_id!});
    performGetCompanyImages({company_id: sessionType!.company_id!});
  }, []);

  useEffect(() => {
    if (companyPayload !== 'not loaded' && companyPayload.payload) {
      performGetLocationParents({location_id: companyPayload.payload.location_id!});
    }
  }, [companyPayload]);

  useEffect(() => {
    if (locationParentsPayload !== 'not loaded' && locationParentsPayload.payload) {
      const country = locationParentsPayload.payload.find( element => element.location_type === LocationType.COUNTRY )!;
      const state = locationParentsPayload.payload.find( element => element.location_type === LocationType.STATE )!;
      const city = locationParentsPayload.payload.find( element => element.location_type === LocationType.CITY )!;
      const town = locationParentsPayload.payload.find( element => element.location_type === LocationType.TOWN )!;
      setPlace({country, state, city, town});
    }
  }, [locationParentsPayload]);

  useEffect(() => {
    if (updateCompany !== 'not loaded') {
      if (updateCompany.errorMessage) {
        toasterDispatch({payload: updateCompany.errorMessage, type: "ERROR"});
      } else {
        toasterDispatch({payload: "Petición regitrada exitosamente", type: "SUCCESS"});
        navigate("/")
      }
    }
  }, [updateCompany]);

  async function onSubmit(values: CompanyModel) {
    performUpdateCompany({company: values, company_id: sessionType!.company_id!, token: token!, user_id: sessionType?.user.id!});
  }


  return (
    <div className='w-full h-full flex justify-center items-center'>
      {
        (isGettingCompanyLoading || companyPayload === 'not loaded') || (isGettingLocationParentsLoading || locationParentsPayload === 'not loaded') ? <Spinner /> :
        <div className='pt-5'>
          <Card className='p-5' radius="sm">
            <CardBody>
              <div className='flex flex-col gap-1 mb-5'>
                <span className='text-2xl font-bold'>Actualización de datos de compañía para nueva solicitud</span>
                <div className='hidden lg:block bg-primary w-1/4 h-1.5'></div>
              </div>
              <Divider className='m-5 lg:m-0 lg:hidden'/>
              <CompanyInfoForm
                initialValues={companyPayload.payload}
                onSubmit={onSubmit}
                validationSchema={() => CompanyInfoSchema(false)}
              >
                <div className='w-full flex flex-col gap-5 justify-center items-center'>
                  <div className='w-full flex justify-start gap-5 items-center'>
                    {
                      companyCharterPayload === 'not loaded' ? null :
                      !companyCharterPayload.payload ? <span>No hay acta constitutiva registrada</span> :
                      <div className='w-auto'>
                        <ButtonComponent
                          color="primary"
                          text="Ver acta constitutiva registrada"
                          type="button"
                          variant="light"
                        />
                      </div>
                    }
                    {
                      companyImagesPayload === 'not loaded' ? null :
                      !companyImagesPayload.payload ? <span>No hay imágenes registradas</span> :
                      <div className='w-auto'>
                        <ButtonComponent
                          color="primary"
                          text="Ver acta imágenes"
                          type="button"
                          variant="light"
                        />
                      </div>
                    }
                  </div>
                  <div className='w-auto'>
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
        </div>
      }
    </div>
  );
}

function AdminUpdateRequest() {
  return (
    <AdminUpdateRequestLayout>
      <Main />
    </AdminUpdateRequestLayout>
  );
}

export default AdminUpdateRequest;
