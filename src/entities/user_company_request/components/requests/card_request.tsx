import { Card, CardBody } from "@heroui/react";
import UserCompanyRequestModel from "../../model";
import { UserCompanyRequestStatus } from "../../types";
import DatesHelpers from "../../../../helpers/dates/helper";
import UserCompanyRequestHelper from "../../helper";
import ButtonComponent from "../../../../components/buttons/component";

interface ICardRequestComponentProps {
  onClick: () => void;
  user_company_request: UserCompanyRequestModel;
}

function CardRequestComponent(props: ICardRequestComponentProps) {
  const helper = new UserCompanyRequestHelper(props.user_company_request);

  return (
    <Card radius="sm" className="w-96 p-5">
      <CardBody className="flex flex-col">
        <span>
          Taller: <strong>{props.user_company_request.company!.name}</strong>
        </span>
        <span>
          Usuario:{" "}
          <strong>{`${props.user_company_request.user!.first_name} ${
            props.user_company_request.user!.last_name
          }`}</strong>
        </span>
        <span>
          Fecha de actualización:{" "}
          <strong>
            {DatesHelpers.formatFullDate(
              props.user_company_request.updated_at as string
            )}
          </strong>
        </span>
        <span>
          Estado de la petición:{" "}
          <span
            className={
              props.user_company_request.status ===
              UserCompanyRequestStatus.APPROVED
                ? "text-green-500"
                : props.user_company_request.status ===
                  UserCompanyRequestStatus.REJECTED
                ? "text-red-400"
                : "text-yellow-400"
            }
          >
            {helper.translateStatus()}
          </span>
        </span>
        {props.user_company_request.message && (
          <span>{props.user_company_request.message}</span>
        )}
        <div className="w-full flex justify-end">
          <div className="w-28">
            <ButtonComponent
              color="primary"
              text="Ver detalle"
              type="button"
              variant="light"
              onClick={props.onClick}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default CardRequestComponent;
