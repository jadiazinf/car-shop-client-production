import { useContext, useEffect, useState } from "react";
import ChooseRegistrationOptionComponent from "./components/choose_registration_option";
import LoginCardComponent from "./components/login_card";
import AuthLayout from "./layout";
import { Card, CardBody } from "@heroui/react";
import BreadcrumbsContext from "../../components/breadcrumbs/context";
import { HeaderBreadcrumbItemProps } from "../../components/breadcrumbs/header";

const BreadCrumbsItems: HeaderBreadcrumbItemProps[] = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Autenticación de usuario",
    url: "/auth",
  },
];

function AuthPage() {

  const [ componentState, setComponentState ] = useState<'login' | 'register'>('login');

  const { setBreadcrumbs } = useContext(BreadcrumbsContext);

  useEffect(( )=> {
    setBreadcrumbs(BreadCrumbsItems);
  }, []);

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
