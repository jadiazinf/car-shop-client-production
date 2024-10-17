// import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NextUIProvider } from '@nextui-org/react';
import { persistorStore, store } from './store/store';
import './index.css';
import './static/fonts/playwriteCU/PlaywriteCU-VariableFont_wght.ttf';
import { App } from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <PersistGate persistor={persistorStore}>
      <Provider store={store}>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </Provider>
    </PersistGate>
  // </React.StrictMode>
);
