import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistorStore, store } from "./store/store";
import { App } from "./app/App";
import { BrowserRouter } from "react-router-dom";
import BreadcrumbsProvider from "./components/breadcrumbs/provider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./components/error-page/component";
import "./index.css";
import "./static/fonts/playwriteCU/PlaywriteCU-VariableFont_wght.ttf";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ErrorBoundary fallback={<ErrorPage />}>
    <PersistGate persistor={persistorStore}>
      <Provider store={store}>
        <BrowserRouter>
          <BreadcrumbsProvider>
            <App />
          </BreadcrumbsProvider>
        </BrowserRouter>
      </Provider>
    </PersistGate>
  </ErrorBoundary>
  // </React.StrictMode>
);
