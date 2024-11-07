import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistorStore, store } from './store/store';
import { App } from './app/App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './static/fonts/playwriteCU/PlaywriteCU-VariableFont_wght.ttf';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <PersistGate persistor={persistorStore}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </PersistGate>
  // </React.StrictMode>
);
