import { useState } from "react";
import ChooseRegistrationOptionComponent from "./components/choose_registration_option";
import LoginCardComponent from "./components/login_card";
import AuthLayout from "./layout";
import { Card, CardBody } from "@heroui/react";

function AuthPage() {

  const [ componentState, setComponentState ] = useState<'login' | 'register'>('login');

  return (
    <AuthLayout>
      <Card radius="sm" className='w-full md:w-2/3 lg:w-1/3'>
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
    </AuthLayout>
  );
}

export default AuthPage;
