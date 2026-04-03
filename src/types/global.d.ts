declare module '*.css' {
  const styles: { [x: string]: string };
  export default styles;
}
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}
