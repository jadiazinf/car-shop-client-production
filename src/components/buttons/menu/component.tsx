import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";
import { MenuButtonComponentProps } from "./types";

function MenuButtonComponent(props: MenuButtonComponentProps) {

  const navigate = useNavigate();

  return (
    <Card radius='sm' className='w-auto hover:scale-105 transform transition duration-300 ease-in-out'>
      <CardBody>
        <div className='p-5 flex flex-col gap-2 justify-start font-dm-sans cursor-pointer' onClick={() => navigate(props.url)}>
          <div className='w-auto'>
            { props.icon }
          </div>
          <span className='text-black text-xl font-bold'>{ props.title }</span>
          <span className='text-black text-opacity-30 font-semibold'>{ props.description }</span>
        </div>
      </CardBody>
    </Card>
  );
}

export default MenuButtonComponent;
