export const getSvg = (id: string) => `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <symbol id="${id}" viewBox="0 0 24 24">
    <style>
      .${id} {fill:none;stroke:var(--x-fill, var(--color-primary));stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    </style>
    <polyline class="${id}" points="15 3 21 3 21 9" />
    <polyline class="${id}" points="9 21 3 21 3 15" />
    <line class="${id}" x1="21" y1="3" x2="14" y2="10" />
    <line class="${id}" x1="3" y1="21" x2="10" y2="14" />
  </symbol>
</svg>
`;
