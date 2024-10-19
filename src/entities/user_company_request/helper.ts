import UserCompanyRequestModel from "./model";
import { UserCompanyRequestStatus } from "./types";

class UserCompanyRequestHelper {

  constructor(
    private readonly _user_company_request: UserCompanyRequestModel
  ){}

  static translateStatusOnAction(value: UserCompanyRequestStatus) {
    switch(value) {
      case UserCompanyRequestStatus.APPROVED:
        return 'Aprobar';
      case UserCompanyRequestStatus.REJECTED:
        return 'Rechazar'
    }
  }

  translateStatus() {
    switch(this._user_company_request.status) {
      case UserCompanyRequestStatus.APPROVED:
        return 'Aprobado';
      case UserCompanyRequestStatus.PENDING:
        return 'Pendiente por aprobación';
      case UserCompanyRequestStatus.REJECTED:
        return 'Rechazado'
    }
  }
}

export default UserCompanyRequestHelper;
