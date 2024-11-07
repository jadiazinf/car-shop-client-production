import { Pagination } from "@nextui-org/react";

function PaginationComponent(props: {page: number, pages: number, setPage: (page: number) => void}) {
  return (
    <Pagination
      showControls
      classNames={{
        cursor: "bg-foreground text-background",
      }}
      color="default"
      page={props.page}
      total={props.pages}
      variant="light"
      onChange={props.setPage}
    />
  );
}

export default PaginationComponent;
