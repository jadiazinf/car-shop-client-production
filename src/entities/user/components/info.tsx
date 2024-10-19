import DatesHelpers from "../../../helpers/dates/helper";
import UserHelper from "../helper";
import UserModel from "../model";

function UserInfo(props: { user: UserModel }) {

  const userHelper = new UserHelper(props.user);

  return (
    <div className='w-full flex flex-col gap-3 border-1.5 rounded-md border-black border-opacity-10 p-5'>
      <div className='w-full text-center'>
        <span className='font-bold text-2xl font-inter'>Información de usuario</span>
      </div>
      <span>Nombre: <strong>{ props.user.first_name }</strong></span>
      <span>Apellido: <strong>{ props.user.last_name }</strong></span>
      <span>Cédula de identidad: <strong>{ props.user.dni }</strong></span>
      <span>Fecha de nacimiento: <strong>{ DatesHelpers.formatYYYYMMDDtoDDMMYYYY(props.user.birthdate as string) }</strong></span>
      <span>Género: <strong>{ userHelper.translateUserGender() }</strong></span>
      <span>Dirección exacta: <strong>{ props.user.address }</strong></span>
      <span>Correo electrónico: <strong>{ props.user.email }</strong></span>
      <span>Número de teléfono: <strong>{ props.user.phone_number }</strong></span>
    </div>
  );
}

export default UserInfo;
