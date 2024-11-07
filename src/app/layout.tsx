import { ReactNode } from "react";
import NavbarComponent from "../components/navbar/navbar";

function MainLayout(props: {children: ReactNode}) {

  return (
    <div className='max-w-screen min-h-screen font-inter container m-auto'>
        <NavbarComponent />
        <div className="w-full h-full px-3 py-10 flex flex-col">
          { props.children }
        </div>
        {/* <div className="w-full footer-height">
        </div> */}
    </div>
  );
}

export default MainLayout;
