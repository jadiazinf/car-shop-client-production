import { Spinner } from "@nextui-org/react";
import useGetAllCompaniesRequests from "../../../entities/user_company_request/services/get_all/use_get_all_requests";
import { useEffect } from "react";

function CompaniesSuperadminPage() {

  const { isGettingAllUsersCompaniesRequestsLoading, payloadState, performGetAllUsersCompaniesRequests } = useGetAllCompaniesRequests();

  useEffect(() => {
    performGetAllUsersCompaniesRequests({});
  }, []);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      {
        isGettingAllUsersCompaniesRequestsLoading ? <Spinner /> :
        payloadState === 'not loaded' || !payloadState.payload ? <span>No hay data</span> :
        payloadState.payload?.data.map( request => (
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
