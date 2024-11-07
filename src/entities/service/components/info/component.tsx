import ServiceModel from "../../model";

function ServiceInfoComponent(props: { service: ServiceModel }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="my-5">
        <span className="font-inter font-bold text-2xl">Información de servicio</span>
      </div>
      <span>Nombre: <strong>{ props.service.name }</strong></span>
      <span>Descripción: <strong>{ props.service.description }</strong></span>
      <span>Tipo de servicio: <strong>{ props.service.service_type }</strong></span>
    </div>
  );
}

export default ServiceInfoComponent;
