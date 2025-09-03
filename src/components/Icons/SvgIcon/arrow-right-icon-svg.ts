export const getSvg = (id: string) => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <symbol id="${id}" viewBox="0 0 512 512">
    <style>
      .${id} {fill:var(--v-fill, var(--color-primary))}
    </style>

    <g>
      <polygon class="${id}" points="163.916,0 92.084,71.822 276.258,255.996 92.084,440.178 163.916,512 419.916,255.996 	"></polygon>
    </g>
  </symbol>
</svg>
`;
