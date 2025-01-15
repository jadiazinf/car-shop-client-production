import UserModel from "../../../model";

export type UpdateUserComponentProps = {
  initialValues: Object;
  validationSchema: Object;
  user_id: number;
  token: string;
  label: string;
  action?: (values: UserModel) => void;
};
