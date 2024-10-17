import { MakeToastReducerActionType } from "../reducer/types";

export type ToasterContextProps = {
  message: string;
  dispatch: React.Dispatch<MakeToastReducerActionType>;
}
