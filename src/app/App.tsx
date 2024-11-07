import EnvironmentVariables from '../helpers/environment/variables';
import { ToasterProvider } from '../components/toaster/provider';
import AppRoutes from '../routes/app_routes';
import MainLayout from './layout';
import { useHref, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

export const App = ():JSX.Element => {

  EnvironmentVariables.checkEnvironmentVariables();

  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <ToasterProvider>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </ToasterProvider>
    </NextUIProvider>
  );
}
