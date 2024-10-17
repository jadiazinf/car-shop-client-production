import { ReactNode } from "react";
import LogoComponent from "../../components/logo/component";

function AuthLayout(props: { children: ReactNode }) {
  return (
    <div className='w-full h-full-w-footer flex flex-col justify-center items-center'>
      <div className='my-5'>
        <LogoComponent size="xl"/>
      </div>
      { props.children }
    </div>
  );
}

export default AuthLayout;
