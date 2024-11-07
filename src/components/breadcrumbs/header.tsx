import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export type HeaderBreadcrumbItemProps = {
  url: string;
  text: string;
}

type HeaderBreadcrumbsProps = {
  items: HeaderBreadcrumbItemProps[]
}

function HeaderBreadcrumbsComponent(props: HeaderBreadcrumbsProps) {

  const navigate = useNavigate();

  return (
    <div className='w-full'>
      <Breadcrumbs underline="hover" color="foreground" onAction={(value) => navigate(value as string)}>
        {
          props.items.map( element => (
            <BreadcrumbItem key={element.url}>{ element.text }</BreadcrumbItem>
          ))
        }
      </Breadcrumbs>
    </div>
  );
}

export default HeaderBreadcrumbsComponent;
