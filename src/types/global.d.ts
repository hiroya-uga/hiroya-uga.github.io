declare module '*.css' {
  const styles: { [x: string]: string };
  export default styles;
}
declare module '*.css?raw' {
  const content: string;
  export default content;
}
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}
