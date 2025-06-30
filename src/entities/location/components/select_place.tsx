import { useContext, useEffect, useState } from "react";
import PlaceContext from "../contexts/place";
import { LocationType, Place } from "../types";
import useGetLocationsByType from "../services/by_type/use_service";
import { Spinner } from "@heroui/react";
import SelectComponent from "../../../components/inputs/select";
import useGetLocationChildrens, {
  GetLocationChildrensProps,
} from "../services/get_childrens/use_get_childrens";

type SelectPlaceProps = {
  selectCountry?: boolean;
  selectCity?: boolean;
  selectState?: boolean;
  selectTown?: boolean;
  direction?: "horizontal" | "vertical";
};

function SelectPlace(props: SelectPlaceProps) {
  const [placeState, setPlaceState] = useState<Place>({
    country: null,
    city: null,
    state: null,
    town: null,
  });

  const { place, setPlace } = useContext(PlaceContext);

  const { isGettingLocationsLoading, payloadState, performGetLocationsByType } =
    useGetLocationsByType();

  const {
    isGettingLocationsChildrensLoading: isGettingCountryChildrensLoading,
    payloadState: countryChildrens, //this are the states
    performGetLocationChildrens: performGetCountryChildrens,
  } = useGetLocationChildrens();

  const {
    isGettingLocationsChildrensLoading: isGettingStateChildrensLoading,
    payloadState: stateChildrens, //this are the cities
    performGetLocationChildrens: performGetStateChildrens,
  } = useGetLocationChildrens();

  const {
    isGettingLocationsChildrensLoading: isGettingCityChildrensLoading,
    payloadState: cityChildrens, //this are the towns
    performGetLocationChildrens: performGetCityChildrens,
  } = useGetLocationChildrens();

  useEffect(() => {
    if (props.selectCountry === undefined || props.selectCountry)
      performGetLocationsByType({ location_type: LocationType.COUNTRY });
  }, []);

  useEffect(() => {
    if (
      (props.selectState === undefined || props.selectState) &&
      placeState.country
    ) {
      performGetCountryChildrens({ location_id: placeState.country.id! });
    }
  }, [placeState.country]);

  useEffect(() => {
    if (
      (props.selectCity === undefined || props.selectCity) &&
      placeState.state
    )
      performGetStateChildrens({ location_id: placeState.state.id! });
  }, [placeState.state]);

  useEffect(() => {
    if ((props.selectTown === undefined || props.selectTown) && placeState.city)
      performGetCityChildrens({ location_id: placeState.city.id! });
  }, [placeState.city]);

  useEffect(() => {
    setPlace(placeState);
  }, [placeState]);

  function getDirectionComponent() {
    if (!props.direction) return null;

    if (props.direction === "horizontal") return "flex-row";

    if (props.direction === "vertical") return "flex-col";
  }

  return (
    <div
      className={`flex ${
        getDirectionComponent()
          ? getDirectionComponent()
          : `flex-col lg:flex-row`
      } gap-3 w-full`}
    >
      {props.selectCountry === false ? null : isGettingLocationsLoading ||
        payloadState === "not loaded" ? (
        <Spinner />
      ) : payloadState.payload === null ? (
        <span>Sin data para el país</span>
      ) : (
        <SelectComponent
          key="country"
          name="country"
          label="País"
          onChange={(value) =>
            setPlaceState((prev) => ({
              ...prev,
              country: payloadState.payload.find(
                (country) => country.id === parseInt(value.target.value)
              )!,
            }))
          }
          value={place?.country ? place.country.id!.toString() : ""}
          isDisabled={isGettingLocationsLoading}
          data={
            payloadState.payload.map((element) => ({
              key: element.id!.toString(),
              label: element.name,
            })) || []
          }
        />
      )}
      {props.selectState === false ? null : (
        <SelectComponent
          key="state"
          name="state"
          label="Estado"
          onChange={(value) =>
            setPlaceState((prev) => ({
              ...prev,
              state: (
                countryChildrens as GetLocationChildrensProps
              ).payload.find(
                (state) => state.id === parseInt(value.target.value)
              )!,
            }))
          }
          value={place?.state ? place.state.id!.toString() : ""}
          isDisabled={
            isGettingCountryChildrensLoading ||
            countryChildrens === "not loaded"
          }
          data={
            (countryChildrens as GetLocationChildrensProps).payload?.map(
              (element) => ({
                key: element.id!.toString(),
                label: element.name,
              })
            ) || []
          }
        />
      )}
      {props.selectCity === false ? null : (
        <SelectComponent
          key="city"
          name="city"
          label="Ciudad"
          onChange={(value) =>
            setPlaceState((prev) => ({
              ...prev,
              city: (stateChildrens as GetLocationChildrensProps).payload.find(
                (city) => city.id === parseInt(value.target.value)
              )!,
            }))
          }
          value={place?.city ? place.city.id!.toString() : ""}
          isDisabled={
            isGettingStateChildrensLoading || stateChildrens === "not loaded"
          }
          data={
            (stateChildrens as GetLocationChildrensProps).payload?.map(
              (element) => ({
                key: element.id!.toString(),
                label: element.name,
              })
            ) || []
          }
        />
      )}
      {props.selectTown === false ? null : (
        <SelectComponent
          key="town"
          name="town"
          label="Municipio"
          onChange={(value) =>
            setPlaceState((prev) => ({
              ...prev,
              town: (cityChildrens as GetLocationChildrensProps).payload.find(
                (town) => town.id === parseInt(value.target.value)
              )!,
            }))
          }
          value={place?.town ? place.town.id!.toString() : ""}
          isDisabled={
            isGettingCityChildrensLoading || cityChildrens === "not loaded"
          }
          data={
            (cityChildrens as GetLocationChildrensProps).payload?.map(
              (element) => ({
                key: element.id!.toString(),
                label: element.name,
              })
            ) || []
          }
        />
      )}
    </div>
  );
}

export default SelectPlace;
