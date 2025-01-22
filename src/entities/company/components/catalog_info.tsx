import CompanyModel from "../model";

interface IProps {
  company: CompanyModel;
  onClick?: (id: number) => void;
}

function CompanyCatalogInfoComponent(props: IProps) {
  return (
    <div
      className={`rounded-md border-1 border-black border-opacity-40 w-full h-72 shadow-sm ${
        props.onClick ? "cursor-pointer" : ""
      }`}
      onClick={
        props.onClick ? () => props.onClick!(props.company.id!) : () => {}
      }
    >
      <div className="w-full h-3/5 mt-1.5">
        <img
          className="h-full m-auto"
          src={`${import.meta.env.VITE_API_BASE_ROUTE + "/"}${
            props.company.profile_image_url
          }`}
        />
      </div>
      <div className="mt-2 flex flex-col gap-2 px-5">
        <p className="text-sm font-bold">{props.company.name}</p>
        <p className="text-sm">{props.company.address}</p>
      </div>
      <div className="w-full mt-5 px-5">
        <p className="text-xs text-black text-right text-opacity-30">
          Click para ver detalle
        </p>
      </div>
    </div>
  );
}

export default CompanyCatalogInfoComponent;
