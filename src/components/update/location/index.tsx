import { useFormik } from "formik";
import ButtonComponent from "../../buttons/component";
import TextComponent from "../../inputs/text";
import LogoComponent from "../../logo/component";
import { LocationSchema } from "../../../entities/location/schemas";
import SelectPlace from "../../../entities/location/components/select_place";
import { useContext, useEffect } from "react";
import PlaceContext from "../../../entities/location/contexts/place";
import PlaceProvider from "../../../entities/location/providers/place";

type LocationProps = {
  location_id: number;
  address: string;
};

type Props = {
  data: LocationProps;
  onUpdate: (values: LocationProps) => void;
  isLoading?: boolean;
};

function Main(props: Props) {
  const { place } = useContext(PlaceContext);

  const formik = useFormik({
    initialValues: props.data,
    onSubmit: props.onUpdate,
    validationSchema: LocationSchema,
  });

  useEffect(() => {
    formik.setFieldValue("location_id", place?.town?.id);
  }, [place?.town]);

  return (
    <div className="flex flex-col items-center">
      <LogoComponent />
      <form className="flex flex-col my-5 gap-5" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <SelectPlace
            selectCity
            selectCountry
            selectState
            selectTown
            direction="vertical"
          />
          {formik.touched.address && formik.errors.location_id && (
            <p className="text-sm text-error">{formik.errors.location_id}</p>
          )}
        </div>
        <div className="flex justify-center flex-col">
          <TextComponent
            name="address"
            type="text"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isError={formik.errors.address}
            errorMessage={formik.errors.address}
          />
          <div className="mt-5">
            <ButtonComponent
              color="primary"
              text="Confirmar"
              type="submit"
              variant="solid"
              isLoading={props.isLoading || false}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export function UpdateLocation(props: Props) {
  return (
    <PlaceProvider>
      <Main {...props} />
    </PlaceProvider>
  );
}
