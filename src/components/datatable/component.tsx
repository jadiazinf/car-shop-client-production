import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { IDatatableComponentProps } from "./interfaces";
import { useCallback, useMemo } from "react";
import { BsThreeDots } from "react-icons/bs";

function DatatableComponent(props: IDatatableComponentProps<any>) {
  const classNames = useMemo(
    () => ({
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  const renderCell = useCallback(
    (user: any, columnKey: any) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown
                className="bg-background border-1 border-default-200"
                radius="sm"
              >
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <div className="rounded-full">
                      <BsThreeDots className="w-5 h-5 text-black text-opacity-45" />
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  selectionMode="single"
                  selectedKeys={props.actionState?.action || undefined}
                  disabledKeys={
                    props.disabledRows && props.disabledRows.includes(user.id)
                      ? ["update", "delete"]
                      : []
                  }
                  onSelectionChange={(key) => {
                    const action = key as unknown as
                      | "view"
                      | "update"
                      | "delete";
                    props.setActionState
                      ? props.setActionState({
                          action: Array.from(action)[0] as
                            | "view"
                            | "update"
                            | "delete",
                          id: user.id,
                        })
                      : null;
                  }}
                >
                  {props.isRowDataViewable ? (
                    <DropdownItem key="view">Ver</DropdownItem>
                  ) : (
                    <></>
                  )}
                  {props.isRowDataEditable ? (
                    <DropdownItem key="update">Editar</DropdownItem>
                  ) : (
                    <></>
                  )}
                  {props.isRowDataDeletable ? (
                    <DropdownItem key="delete">Desactivar</DropdownItem>
                  ) : (
                    <></>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [props.disabledRows, props.actionState]
  );

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContentPlacement="outside"
      radius="sm"
      isStriped
      showSelectionCheckboxes={props.showCheckboxes ?? true}
      classNames={classNames}
      disabledKeys={props.disabledRows || []}
      checkboxesProps={{
        radius: "sm",
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background",
        },
      }}
      selectedKeys={
        Array.isArray(props.selectedData)
          ? props.selectedData.map((element) => element.toString())
          : "all"
      }
      onSelectionChange={(keys) =>
        !props.setSelectedData
          ? null
          : keys === "all"
          ? props.setSelectedData("all")
          : props.setSelectedData(
              //@ts-ignore
              Array.from(keys).map((element) => parseInt(element))
            )
      }
      selectionMode={props.selectionMode || "none"}
    >
      <TableHeader columns={props.columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent={props.noContentMessage || "Sin data que mostrar"}
        items={props.data}
        loadingContent={<Spinner />}
        loadingState={props.isLoading ? "loading" : "idle"}
      >
        {(item) => (
          <TableRow key={item.id} className="cursor-pointer">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DatatableComponent;
