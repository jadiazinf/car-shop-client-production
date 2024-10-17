import { MakeToastReducerActionType } from "./types";

export const makeToastReducer = (_: {message: string; type: "SUCCESS" | "ERROR" | "CLEAR"}, action: MakeToastReducerActionType): {message: string; type: "SUCCESS" | "ERROR" | "CLEAR"}  => {
  switch (action.type) {
    case "SUCCESS":
      return { message: action.payload, type: "SUCCESS" };
    case "ERROR":
      return { message: action.payload, type: "ERROR" };
    case "CLEAR":
      return { message: "", type: "CLEAR" };
  }
}
