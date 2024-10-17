import { useState } from "react";
import ChooseRegistrationOptionComponent from "./components/choose_registration_option";
import LoginCardComponent from "./components/login_card";
import AuthLayout from "./layout";
import { Card, CardBody } from "@nextui-org/react";

function AuthPage() {

  const [ componentState, setComponentState ] = useState<'login' | 'register'>('login');

  return (
    <AuthLayout>
      <div className='flex flex-col items-center px-5 w-full md:w-3/4 lg:w-3/5'>
        <Card radius="sm" className='w-full md:1/2 lg:w-3/5 px-5 py-10'>
          <CardBody className='p-5 text-center'>
            {
              componentState === 'login' ?
                <LoginCardComponent
                  setAuthOptionState={setComponentState}
                />
              :
                <ChooseRegistrationOptionComponent
                  setAuthOptionState={setComponentState}
                />
            }
          </CardBody>
        </Card>
      </div>
    </AuthLayout>
  );
}

export default AuthPage;
