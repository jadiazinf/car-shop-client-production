import CompanyModel from "../model";

function CompanyInfo(props: { company: CompanyModel }) {
  return (
    <div className='w-full flex flex-col gap-3'>
      <div className='w-full text-center'>
        <span className='font-bold text-2xl font-inter'>Información de taller mecánico</span>
      </div>
      <span>Nombre: <strong>{ props.company.name }</strong></span>
      <span>RIF: <strong>{ props.company.dni }</strong></span>
      <span>Correo electrónico: <strong>{ props.company.email }</strong></span>
      <span>Dirección exacta: <strong>{ props.company.address }</strong></span>
    </div>
  );
}

export default CompanyInfo;
