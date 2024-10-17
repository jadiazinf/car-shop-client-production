import { useContext, useEffect, useState } from "react";
import PlaceContext from "../contexts/place";
import { LocationType, Place } from "../types";
import useGetLocationsByType from "../services/by_type/use_service";
import { Spinner } from "@nextui-org/react";
import SelectComponent from "../../../components/inputs/select";
import useGetLocationChildrens, { GetLocationChildrensProps } from "../services/get_childrens/use_get_childrens";

function SelectPlace() {

  const [ placeState, setPlaceState ] = useState<Place>({country: null, city: null, state: null, town: null});

  const { place, setPlace } = useContext(PlaceContext);

  const {
    isGettingLocationsLoading,
    payloadState,
    performGetLocationsByType
  } = useGetLocationsByType();

  const {
    isGettingLocationsChildrensLoading: isGettingCountryChildrensLoading,
    payloadState: countryChildrens, //this are the states
    performGetLocationChildrens: performGetCountryChildrens
  } = useGetLocationChildrens();

  const {
    isGettingLocationsChildrensLoading: isGettingStateChildrensLoading,
    payloadState: stateChildrens, //this are the cities
    performGetLocationChildrens: performGetStateChildrens
  } = useGetLocationChildrens();

  const {
    isGettingLocationsChildrensLoading: isGettingCityChildrensLoading,
    payloadState: cityChildrens, //this are the towns
    performGetLocationChildrens: performGetCityChildrens
  } = useGetLocationChildrens();

  useEffect(() => {
    performGetLocationsByType({location_type: LocationType.COUNTRY});
  }, []);

  useEffect(() => {
    setPlace(placeState);
  }, [placeState]);

  useEffect(() => {
    if (placeState.country) {
      performGetCountryChildrens({location_id: placeState.country.id!})
    }
  }, [placeState.country]);

  useEffect(() => {
    if (placeState.state)
      performGetStateChildrens({location_id: placeState.state.id!})
  }, [placeState.state]);

  useEffect(() => {
    if (placeState.city)
      performGetCityChildrens({location_id: placeState.city.id!})
  }, [placeState.city]);

  return (
    <div className='flex flex-col lg:flex-row gap-3'>
      {
        isGettingLocationsLoading || payloadState === 'not loaded' ? <Spinner /> :
        payloadState.payload === null ? <span>Sin data para el país</span> :
        <SelectComponent
          key="country"
          name="country"
          label="País"
          onChange={(value) => setPlaceState(prev => ({...prev, country: payloadState.payload.find( country => country.id === parseInt(value.target.value) )!}))}
          value={place?.country ? place.country.id!.toString() : ''}
          isDisabled={isGettingLocationsLoading}
          data={payloadState.payload.map(element => ({key: element.id!.toString(), label: element.name})) || []}
        />
      }
        <SelectComponent
          key="state"
          name="state"
          label="Estado"
          onChange={(value) => setPlaceState(prev => ({...prev, state: (countryChildrens as GetLocationChildrensProps).payload.find( state => state.id === parseInt(value.target.value) )!}))}
          value={place?.state ? place.state.id!.toString() : ''}
          isDisabled={isGettingCountryChildrensLoading || countryChildrens === 'not loaded'}
          data={(countryChildrens as GetLocationChildrensProps).payload?.map(element => ({key: element.id!.toString(), label: element.name})) || []}
        />
        <SelectComponent
          key="city"
          name="city"
          label="Ciudad"
          onChange={(value) => setPlaceState(prev => ({...prev, city: (stateChildrens as GetLocationChildrensProps).payload.find( city => city.id === parseInt(value.target.value) )!}))}
          value={place?.city ? place.city.id!.toString() : ''}
          isDisabled={isGettingStateChildrensLoading || stateChildrens === 'not loaded'}
          data={(stateChildrens as GetLocationChildrensProps).payload?.map(element => ({key: element.id!.toString(), label: element.name})) || []}
        />
        <SelectComponent
          key="town"
          name="town"
          label="Municipio"
          onChange={(value) => setPlaceState(prev => ({...prev, town: (cityChildrens as GetLocationChildrensProps).payload.find( town => town.id === parseInt(value.target.value) )!}))}
          value={place?.town ? place.town.id!.toString() : ''}
          isDisabled={isGettingCityChildrensLoading || cityChildrens === 'not loaded'}
          data={(cityChildrens as GetLocationChildrensProps).payload?.map(element => ({key: element.id!.toString(), label: element.name})) || []}
        />
    </div>
  );
}

export default SelectPlace;
