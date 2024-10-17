import ButtonComponent from "../../../components/buttons/component";
import { IAuthComponentProps } from "./interfaces";
import { LiaToolsSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ChooseRegistrationOptionComponent(props: IAuthComponentProps) {

  const navigate = useNavigate();

  return (
    <>
      <h1 className='text-2xl font-bold'>Tipo de registro</h1>
      <div className='mt-10 flex flex-col items-center justify-center gap-5'>
        <ButtonComponent
          color="primary"
          text="Registrar taller"
          type="button"
          variant="solid"
          startContent={<LiaToolsSolid />}
          onClick={() => navigate("/auth/registration/company")}
        />
        <ButtonComponent
          color="primary"
          text="Usuario general"
          type="button"
          variant="bordered"
          startContent={<FaUser />}
          onClick={() => navigate("/auth/registration/general-user")}
        />
      </div>
      <div className='w-auto mt-2 flex items-center gap-2 justify-center'>
        <span className='text-sm text-black text-opacity-50'>¿Ya tienes una cuenta?</span>
        <div className='w-auto'>
          <ButtonComponent
            color="primary"
            text="Iniciar sesión"
            type="button"
            variant="light"
            onClick={() => props.setAuthOptionState('login')}
          />
        </div>
      </div>
    </>
  );
}

export default ChooseRegistrationOptionComponent;
