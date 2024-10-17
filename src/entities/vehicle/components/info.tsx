import VehicleModel from "../model";

function VehicleInfo(props: { vehicle: VehicleModel }) {
  return (
    <div className='w-full flex flex-col gap-3'>
      <div className='w-full text-center'>
        <span className='font-bold text-2xl font-inter'>Información de vehículo</span>
      </div>
      <span>Marca: <strong>{ props.vehicle.model?.brand?.name }</strong></span>
      <span>Modelo: <strong>{ props.vehicle.model?.name }</strong></span>
      <span>Color: <strong>{ props.vehicle.color }</strong></span>
      <span>Placa: <strong>{ props.vehicle.license_plate }</strong></span>
      <span>Año: <strong>{ props.vehicle.year }</strong></span>
      <span>Ejes: <strong>{ props.vehicle.axles }</strong></span>
      <span>Cantidad de ruedas: <strong>{ props.vehicle.tires }</strong></span>
      <span>Tipo de vehículo: <strong>{ props.vehicle.vehicle_type }</strong></span>
      <span>Transmisión: <strong>{ props.vehicle.transmission }</strong></span>
    </div>
  );
}

export default VehicleInfo;
