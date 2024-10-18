export type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

export type MakeToastReducerActionType =
{ type: "SUCCESS", payload: string } |
{ type: "ERROR", payload: string } |
{ type: "CLEAR" };
