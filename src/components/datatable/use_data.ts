import { useState } from "react";

function useDataFromDatatable() {
  const [ selectedValues, setSelectedValues ] = useState<number[] | "all">([]);

  return { selectedValues, setSelectedValues }
}

export default useDataFromDatatable;
