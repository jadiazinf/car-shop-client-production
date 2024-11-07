import { ReactNode } from "react";

function MenuOptionsContainer(props: { children: ReactNode }) {
  return (
    <div className='py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      { props.children }
    </div>
  );
}

export default MenuOptionsContainer;
