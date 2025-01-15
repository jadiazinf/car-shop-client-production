import { useContext } from "react";
import { useUsersApiServices } from "../../../../../app/api/users";
import { UpdateUserComponentProps } from "./types";
import { ToasterContext } from "../../../../../components/toaster/context/context";
import { StatusCodes } from "http-status-codes";
import UserModel from "../../../model";
import { useFormik } from "formik";
import LogoComponent from "../../../../../components/logo/component";
import TextComponent from "../../../../../components/inputs/text";
import ButtonComponent from "../../../../../components/buttons/component";

export function UpdateUserTextFieldComponent(props: UpdateUserComponentProps) {
  const { isUpdatingUser, perform } = useUsersApiServices.updateGeneralUser();

  const { dispatch } = useContext(ToasterContext);

  async function onSubmit(values: Object) {
    const response = await perform(props.user_id, values, props.token);
    if (response.status === StatusCodes.OK) {
      dispatch({
        payload: "Usuario actualizado correctamente",
        type: "SUCCESS",
      });
      if (props.action) props.action(response.data as UserModel);
    } else {
      dispatch({
        payload: (response.data as { errors: string[] }).errors
          ? (response.data as { errors: string[] }).errors[0]
          : "Usuario no pudo ser actualizado",
        type: "ERROR",
      });
    }
  }

  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit,
    validationSchema: props.validationSchema,
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <LogoComponent />
      <form
        className="my-5 text-center flex flex-col gap-3"
        onSubmit={formik.handleSubmit}
      >
        <TextComponent
          label={props.label}
          name={Object.keys(formik.values)[0]}
          type="text"
          value={Object.values(formik.values)[0]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            Object.values(formik.errors)[0]
              ? Object.values(formik.errors)[0]
              : ""
          }
          isError={Object.keys(formik.errors)[0]}
        />
        <div className="flex justify-center mt-5">
          <div className="w-auto">
            <ButtonComponent
              color="primary"
              text="Confirmar"
              type="submit"
              variant="solid"
              isLoading={isUpdatingUser}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
