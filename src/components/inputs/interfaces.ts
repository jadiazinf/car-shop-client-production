import { ChangeEventHandler, ReactNode } from "react";

export interface IBaseInputProps {
  name: string;
  value: string;
  type: "password" | "text" | "number" | "date";
  isError?: any;
  errorMessage?: any;
  label?: string;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?:
    | (React.FocusEventHandler<HTMLInputElement> &
        ((e: React.FocusEvent<Element, Element>) => void))
    | undefined;
  variant?: "bordered" | "underlined" | "flat" | "faded";
  isDisabled?: boolean;
  step?: number;
}

export type SelectDataProps = {
  key: string;
  label: string;
};

export interface IBaseSelectProps {
  disallowEmptySelection?: boolean;
  data: SelectDataProps[];
  name: string;
  value: string;
  isError?: any;
  errorMessage?: any;
  variant?: "bordered" | "underlined";
  label?: string;
  placeholder?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  size?: "sm" | "md" | "lg";
  onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
  onBlur?:
    | (React.FocusEventHandler<HTMLInputElement> &
        ((e: React.FocusEvent<Element, Element>) => void))
    | undefined;
  isDisabled?: boolean;
}
