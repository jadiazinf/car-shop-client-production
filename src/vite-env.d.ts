/// <reference types="vite/client" />
/// <reference types="redux-persist" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: 'development' | 'production'
  readonly VITE_API_BASE_ROUTE: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_REDUX_PERSIST_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
