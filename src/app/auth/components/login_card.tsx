import LoginForm from "../../../auth/components/forms/login";
import ButtonComponent from "../../../components/buttons/component";
import { IAuthComponentProps } from "./interfaces";

function LoginCardComponent(props: IAuthComponentProps) {
  return (
    <>
      <h1 className='text-2xl font-bold'>Iniciar sesión</h1>
      <div className='mt-10'>
        <LoginForm />
        <div className='w-auto mt-2 flex items-center gap-2 justify-center'>
          <span className='text-sm text-black text-opacity-50'>¿No tienes una cuenta?</span>
          <div className='w-auto'>
            <ButtonComponent
              color="primary"
              text="Registrarme"
              type="button"
              variant="light"
              onClick={() => props.setAuthOptionState('register')}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginCardComponent;
