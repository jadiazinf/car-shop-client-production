import { MakeToastReducerActionType } from "./types";

interface ToastMessage {
  message: string;
  type: "SUCCESS" | "ERROR";
}

type ToastState = ToastMessage[];

export const makeToastReducer = (state: ToastState, action: MakeToastReducerActionType): ToastState => {
  switch (action.type) {
    case "SUCCESS":
      return [...state, { message: action.payload, type: "SUCCESS" }];
    case "ERROR":
      return [...state, { message: action.payload, type: "ERROR" }];
    case "CLEAR":
      return [];
    default:
      return state;
  }
};
