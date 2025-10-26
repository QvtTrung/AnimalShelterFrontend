/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other environment variable type definitions here
  // readonly VITE_SOME_OTHER_VAR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
