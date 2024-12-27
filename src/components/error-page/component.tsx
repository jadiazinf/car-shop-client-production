import ButtonComponent from "../buttons/component";

function ErrorPage() {
  function handleGoHome() {
    window.location.href = "/";
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-semibold text-gray-800">
          Oops, ha ocurrido un error
        </h1>
        <p className="mt-4 text-gray-600">
          Lo sentimos, si el error persiste por favor contacte a soporte.
        </p>
        <div className="flex justify-center">
          <div className="w-auto mt-5">
            <ButtonComponent
              text="Volver al inicio"
              color="primary"
              type="button"
              variant="solid"
              onClick={handleGoHome}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
