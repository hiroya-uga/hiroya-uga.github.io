export const getSvg = (id: string) => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <symbol id="${id}" viewBox="0 0 512 512" x="0px" y="0px">
    <style>
      .${id} {fill:var(--v-fill, var(--color-primary))}
    </style>

    <g>
      <path class="${id}" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"></path>
      <polygon class="${id}" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"></polygon>
      <polygon class="${id}" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688
        237.594,166.688 322.39,166.688 204.531,284.547 	"></polygon>
    </g>
  </symbol>
</svg>
`;
