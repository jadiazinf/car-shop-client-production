import { ReactNode } from "react";

export interface IButtonComponentProps {
  type: 'submit' | 'button' | 'reset';
  text: string;
  color: 'primary' | 'secondary';
  variant: 'solid' | 'bordered' | 'ghost' | 'light'
  onClick?: () => void;
  isLoading?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isDisabled?: boolean;
}
