export const getSvg = (id: string) => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <symbol id="${id}" viewBox="0 0 512 512" x="0px" y="0px">
    <style>
      .${id} {fill:var(--v-fill, var(--color-text))}
    </style>

    <g>
      <polygon class="${id}" points="243.253,0 202.714,40.539 389.5,227.335 12.736,227.335 12.736,284.665 389.5,284.665
        202.714,471.461 243.253,512 499.264,256 	" ></polygon>
    </g>
  </symbol>
</svg>
`;
