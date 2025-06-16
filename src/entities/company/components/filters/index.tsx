import { Checkbox, Divider, Input, Spinner } from "@heroui/react";
import { IServicesFilterProps } from "./interfaces";
import useGetAllCategories from "../../../category/services/get_all/use_get_all_categories";
import { useContext, useEffect } from "react";
import SelectPlace from "../../../location/components/select_place";
import PlaceContext from "../../../location/contexts/place";
import CategoryModel from "../../../category/model";
import { useSearchParams } from "react-router-dom";

function CompaniesFiltersComponent(props: IServicesFilterProps) {
  const { place } = useContext(PlaceContext);

  const {
    isGettingAllCategoriesLoading,
    payloadState: categories,
    performGetAllCategories,
  } = useGetAllCategories();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    performGetAllCategories();
  }, []);

  useEffect(() => {
    if (place && place.state && place.city) {
      props.setFiltersChange({
        ...props.filtersState,
        location_id: place.state.id!,
      });
      searchParams.set("location_id", place.city.id!.toString());
      setSearchParams(searchParams);
    }
  }, [place?.city]);

  function handleChange(e: React.ChangeEvent) {
    const { name, value } = e.target as HTMLInputElement;
    props.setFiltersChange({ ...props.filtersState, [name]: value });
  }

  function handleCategoryChange(id: number) {
    if (!props.filtersState.category_ids) {
      props.setFiltersChange({
        ...props.filtersState,
        category_ids: [id],
      });
      return;
    }

    if (props.filtersState.category_ids.some((element) => element === id))
      props.setFiltersChange({
        ...props.filtersState,
        category_ids: props.filtersState.category_ids.filter(
          (element) => element !== id
        ),
      });
    else
      props.setFiltersChange({
        ...props.filtersState,
        category_ids: [...props.filtersState.category_ids, id],
      });
  }

  return (
    <div className="flex flex-col gap-5 h-full w-full">
      <div className="flex flex-col">
        <p className="text-sm font-semibold">Nombre del taller</p>
        <div className="mt-5">
          <Input
            radius="sm"
            variant="bordered"
            name="company_name"
            type="text"
            value={props.filtersState.company_name || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <Divider className="mb-5" />
        <p className="text-sm font-semibold">Buscar por lugar</p>
        <div>
          <SelectPlace
            selectCountry
            selectState
            selectCity
            selectTown={false}
            direction="vertical"
          />
        </div>
      </div>
      <div className="flex flex-col mb-10">
        <Divider className="mb-5" />
        <p className="text-sm font-semibold">
          Buscar por categorías de servicio
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {categories ===
          "not loaded" ? null : isGettingAllCategoriesLoading ? (
            <div className="w-full flex justify-center my-5">
              <Spinner />
            </div>
          ) : (
            (categories.payload as CategoryModel[]).map((element) => (
              <Checkbox
                radius="sm"
                key={element.id}
                isSelected={
                  props.filtersState.category_ids?.some(
                    (serviceId) => serviceId === element.id
                  ) || false
                }
                onValueChange={() => handleCategoryChange(element.id!)}
              >
                {element.name}
              </Checkbox>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CompaniesFiltersComponent;
