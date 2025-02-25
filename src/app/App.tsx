import "./api/interceptors/axios";
import "./api/interceptors/api";
import EnvironmentVariables from "../helpers/environment/variables";
import { ToasterProvider } from "../components/toaster/provider";
import AppRoutes from "../routes/app_routes";
import MainLayout from "./layout";
import { useHref, useNavigate } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import MenuProvider from "../components/menu/provider";

export const App = (): JSX.Element => {
  EnvironmentVariables.checkEnvironmentVariables();

  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToasterProvider>
        <MenuProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </MenuProvider>
      </ToasterProvider>
    </HeroUIProvider>
  );
};
