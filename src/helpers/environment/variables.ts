class EnvironmentVariables {
  static APP_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
  static API_BASE_ROUTE = import.meta.env.VITE_API_BASE_ROUTE;
  static API_VERSION = import.meta.env.VITE_API_VERSION;
  static REDUX_PERSIST_KEY = import.meta.env.VITE_REDUX_PERSIST_KEY;

  static checkEnvironmentVariables() {
    if (!EnvironmentVariables.APP_ENVIRONMENT) throw new Error("ENVIRONMENT VARIABLE APP ENVIRONMENT IS NOT DEFINED");
    if (!EnvironmentVariables.API_BASE_ROUTE) throw new Error("ENVIRONMENT VARIABLE API BASE ROUTE IS NOT DEFINED");
    if (!EnvironmentVariables.API_VERSION) throw new Error("ENVIRONMENT VARIABLE API VERSION IS NOT DEFINED");
    if (!EnvironmentVariables.REDUX_PERSIST_KEY) throw new Error("ENVIRONMENT VARIABLE REDUX PERSIST KEY IS NOT DEFINED");
  }
}

export default EnvironmentVariables;
