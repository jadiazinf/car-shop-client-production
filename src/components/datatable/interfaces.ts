import { DatatableColumnsProps } from "./types";

export interface IDatatableComponentProps<T> {
  data: T[];
  selectedData?: number[] | "all";
  setSelectedData?:
    | React.Dispatch<number[] | "all">
    | ((id: number[] | "all") => void);
  disabledRows?: number[];
  columns: DatatableColumnsProps[];
  selectionMode?: "single" | "multiple" | "none";
  isLoading?: boolean;
  onEditAction?: (id: number) => void;
  onDeleteAction?: (id: number) => void;
  onViewAction?: (id: number) => void;
  actionState?: {
    action: "view" | "update" | "delete" | "";
    id: number | null;
  };
  isRowDataViewable?: boolean;
  isRowDataEditable?: boolean;
  isRowDataDeletable?: boolean;
  noContentMessage?: string;
  setActionState?: React.Dispatch<{
    action: "view" | "update" | "delete" | "";
    id: number | null;
  }>;
  showCheckboxes?: boolean;
}
