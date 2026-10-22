/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Bas-URL till backend-API:t, t.ex. http://localhost:5080. Utan den körs appen helt lokalt. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
