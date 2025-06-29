export const getSvg = (id: string) => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <symbol id="${id}" viewBox="0 0 512 512" x="0px" y="0px">
    <style>
      .${id} {fill:var(--v-fill, var(--color-text))}
    </style>

    <g>
      <polygon class="${id}" points="419.916,71.821 348.084,0 92.084,256.005 348.084,512 419.916,440.178 235.742,256.005 	" ></polygon>
    </g>
  </symbol>
</svg>
`;
