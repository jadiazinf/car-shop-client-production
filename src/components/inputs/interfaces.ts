import { ChangeEventHandler, ReactNode } from "react";

export interface IBaseInputProps {
  name: string;
  value: string;
  type: 'password' | 'text' | 'number' | 'date';
  isError?: any;
  errorMessage?: any;
  label?: string;
  placeholder?:string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur?: (React.FocusEventHandler<HTMLInputElement> & ((e: React.FocusEvent<Element, Element>) => void)) | undefined;
}


export type SelectDataProps = {
  key: string;
  label: string;
}

export interface IBaseSelectProps {
  data: SelectDataProps[];
  name: string;
  value: string;
  isError?: any;
  errorMessage?: any;
  label?: string;
  placeholder?:string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
  onBlur?: (React.FocusEventHandler<HTMLInputElement> & ((e: React.FocusEvent<Element, Element>) => void)) | undefined;
  isDisabled?: boolean;
}
