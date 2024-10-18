import { Spinner } from "@nextui-org/react";
import useGetAllCompaniesRequests from "../../../entities/companies_requests/services/get_all/use_get_all_requests";
import { useEffect } from "react";

function CompaniesSuperadminPage() {

  const { isGettingAllCompaniesRequestsLoading, payloadState, performGetAllCompaniesRequests } = useGetAllCompaniesRequests();

  useEffect(() => {
    performGetAllCompaniesRequests();
  }, []);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      {
        isGettingAllCompaniesRequestsLoading ? <Spinner /> :
        payloadState === 'not loaded' || !payloadState.payload ? <span>No hay data</span> :
        payloadState.payload?.map( request => (
          <div className='flex flex-col gap-2 text-center'>
            <span>{ request.created_at }</span>
            <span>{ request.status }</span>
          </div>
        ) ) || <span>Sin data</span>
      }
    </div>
  );
}

export default CompaniesSuperadminPage;
