import ButtonComponent from "../../../../../../components/buttons/component";
import UserModel from "../../../../../../entities/user/model";
import SearchPerson from "../../../../companies/members/new/components/search_person";

interface IProps {
  selectedPerson: UserModel | null;
  setSelectedPerson: (user: UserModel | null) => void;
  onNext: () => void;
}

export function SearchUserForNewOrderService(props: IProps) {
  return (
    <div className="w-full h-full">
      <p className="text-xl font-semibold mb-5">
        Buscar usuario para nueva orden de servicio
      </p>
      <SearchPerson
        selectedPerson={props.selectedPerson}
        setSelectedPerson={props.setSelectedPerson}
      />
      <div className="w-full mt-3 flex justify-end">
        <div className="w-auto">
          <ButtonComponent
            text="Siguiente"
            color="primary"
            type="button"
            variant="solid"
            isDisabled={!props.selectedPerson}
            onClick={() => props.onNext()}
          />
        </div>
      </div>
    </div>
  );
}
