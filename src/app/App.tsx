import { BrowserRouter } from 'react-router-dom';
import EnvironmentVariables from '../helpers/environment/variables';
import { ToasterProvider } from '../components/toaster/provider';
import AppRoutes from '../routes/app_routes';
import MainLayout from './layout';

export const App = ():JSX.Element => {

  EnvironmentVariables.checkEnvironmentVariables();

  return (
    <ToasterProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </ToasterProvider>
  );
}
