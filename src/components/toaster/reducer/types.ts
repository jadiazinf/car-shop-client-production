export type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR" | "INFO";
};

export type MakeToastReducerActionType =
  | { type: "SUCCESS"; payload: string }
  | { type: "ERROR"; payload: string }
  | { type: "INFO"; payload: string }
  | { type: "CLEAR" };
