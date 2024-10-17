import { FormEvent, useContext, useState } from "react";
import useLoginService, { LoginServiceData } from "../../services/login/use_login";
import ButtonComponent from "../../../components/buttons/component";
import TextComponent from "../../../components/inputs/text";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { ToasterContext } from "../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import { SetAuthentication } from "../../../store/auth/reducers";
import { AuthStatus } from "../../types";

function LoginForm() {

  const [ formState, setFormState ] = useState<{email: string; password: string;}>({email: '', password: ''});

  const { isLoginLoading, performLogin } = useLoginService();

  const appDispatch = useDispatch();

  const { dispatch: toasterDispatch } = useContext(ToasterContext);

  async function handleLogin(data: LoginServiceData) {
    if (data.status !== StatusCodes.OK) {
      toasterDispatch({payload: data.errorMessage || 'Autenticación de usuario fallida', type: 'ERROR'})
      return;
    }

    appDispatch(SetAuthentication({status: AuthStatus.AUTHENTICATED, sessionType: {user: data.payload, company_id: null, roles: []}, token: data.token}))
  }

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      performLogin({email: formState.email, password: formState.password}, handleLogin);
    } catch(error) {
      console.log(error);
    }
  }

  function handleChange(e: React.ChangeEvent) {
    e.preventDefault();
    const { name, value } = e.target as HTMLInputElement;
    setFormState((prev) => ({...prev, [name]: value}));
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
      <TextComponent
        startContent={<FaUser className='text-black text-opacity-20'/>}
        name="email"
        value={formState.email}
        key="email"
        onChange={handleChange}
        type="text"
        label="Correo electrónico"
      />
      <TextComponent
        startContent={<FaLock className='text-black text-opacity-20'/>}
        value={formState.password}
        name="password"
        key="password"
        onChange={handleChange}
        type="password"
        label="Contraseña"
      />
      <div className='mt-5'>
        <ButtonComponent
          color="primary"
          text="Login"
          type="submit"
          variant="solid"
          isLoading={isLoginLoading}
        />
      </div>
    </form>
  );
}

export default LoginForm;
