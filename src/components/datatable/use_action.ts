import { useState } from "react";

function useDatatableAction() {
  const [ datatableAction, setDatatableAction ] = useState<{
    action: "view" | "update" | "delete" | "",
    id: number | null;
  }>({
    action: "",
    id: null
  });

  return { datatableAction, setDatatableAction };
}

export default useDatatableAction;
