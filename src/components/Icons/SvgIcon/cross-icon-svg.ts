export const getSvg = (id: string) => `
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    <symbol id="${id}" viewBox="0 0 512 512">
      <style>
        .${id} {fill:var(--v-fill, var(--color-primary))}
      </style>
      <g>
        <polygon class="${id}" points="512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465
          52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005 	"></polygon>
      </g>
    </symbol>
  </svg>
`;
