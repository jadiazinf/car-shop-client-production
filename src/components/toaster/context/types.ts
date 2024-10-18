import { MakeToastReducerActionType, ToastMessage } from "../reducer/types";

export type ToasterContextProps = {
  messages: ToastMessage[];
  dispatch: React.Dispatch<MakeToastReducerActionType>;
}
