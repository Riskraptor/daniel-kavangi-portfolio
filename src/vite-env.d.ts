/// <reference types="vite/client" />

declare module "*.jsx" {
  const component: React.ComponentType<Record<string, unknown>>;
  export default component;
}

declare module "*.pdf" {
  const src: string;
  export default src;
}

declare module "*.pdf?url" {
  const src: string;
  export default src;
}
