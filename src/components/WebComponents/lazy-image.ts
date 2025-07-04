export const LazyImageLoad = () => {
  class LazyImage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    get alt() {
      return this.getAttribute('alt') ?? '';
    }
    set alt(value: string) {
      this.setAttribute('alt', value);
    }
    get src() {
      return this.getAttribute('src') ?? '';
    }
    set src(value: string) {
      this.setAttribute('src', value);
    }
    get width() {
      return parseInt(this.getAttribute('width') ?? '', 10);
    }
    set width(value: number) {
      this.setAttribute('width', String(value));
    }
    get height() {
      return parseInt(this.getAttribute('height') ?? '', 10);
    }
    set height(value: number) {
      this.setAttribute('height', String(value));
    }

    get loading() {
      return typeof this.getAttribute('loading') === 'string';
    }
    set loading(value: boolean) {
      if (value) {
        this.setAttribute('loading', '');
      } else {
        this.removeAttribute('loading');
      }
    }

    connectedCallback() {
      const { src, width, height, alt } = this;

      if (!src || !this.shadowRoot) return;

      const img = document.createElement('img');

      if (width && height) {
        const style = new CSSStyleSheet();

        img.width = width;
        img.height = height;
        style.replaceSync(
          `
          :host {
            display: block;
            transition: 0.3s opacity ease-out;

            @starting-style {
              opacity: 0;
            }
          }
          :host img {
            display: block;
            width: 100%;
            height: auto;
          }
          :host(lazy-image[loading]),
          :host(lazy-image[loading]) img {
            opacity: 0;
            visibility: hidden;
          }
          `,
        );
        this.shadowRoot.adoptedStyleSheets = [style];
      }
      img.addEventListener(
        'load',
        (e) => {
          if (e.currentTarget instanceof HTMLImageElement) {
            this.loading = false;
          }
        },
        { once: true },
      );

      img.alt = alt;
      img.width = width;
      img.height = height;
      img.src = src;
      this.loading = true;
      this.shadowRoot.appendChild(img);
    }
  }

  // カスタム要素として登録
  customElements.define('lazy-image', LazyImage);
};
