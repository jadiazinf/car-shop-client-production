import PlaceProvider from "../../../../../entities/location/providers/place";
import OptionBoxComponent from "./components/option_box";

function CompanyNewMemberPage() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full lg:w-2/3 flex justify-center items-center">
        <PlaceProvider>
          <OptionBoxComponent />
        </PlaceProvider>
      </div>
    </div>
  );
}

export default CompanyNewMemberPage;
