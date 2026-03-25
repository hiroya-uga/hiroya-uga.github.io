let lazyImageCounter = 0;
const styleId = 'lazy-image-modal-styles';

const injectModalStyles = () => {
  const style = document.getElementById(styleId);
  if (style) return;
  const element = document.createElement('style');
  element.id = styleId;
  element.textContent = `
      dialog.lazy-image-modal {
        --v-backdrop: rgba(0, 0, 0, 0.8);

        font-size: 0.875rem;
        padding: 1lh 0;
        border: none;
        background: transparent;
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        place-items: center;
        position: fixed;
        inset: 0;
        pointer-events: none;

        &[open] {
          display: grid;
        }
      }

      dialog.lazy-image-modal::backdrop {
        background: var(--v-backdrop);
        backdrop-filter: blur(4px);
        transition: 0.3s background ease-out, 0.3s backdrop-filter ease-out;

        @starting-style {
          background: rgba(0, 0, 0, 0);
          backdrop-filter: blur(0);
        }
      }

      dialog.lazy-image-modal__content {
        max-width: 90dvw;
        max-height: calc(90dvh - 1lh);
        margin: auto;
        overflow: clip auto;
        overscroll-behavior: contain;
        pointer-events: auto;
      }

      .lazy-image-modal__caption {
        position: sticky;
        bottom: 0;
        color: #fff;
        transition: 0.3s opacity ease-out;
        pointer-events: auto;
        cursor: auto;
        width: fit-content;

        @starting-style {
          opacity: 0;
        }
      }

      .lazy-image-modal__caption:empty {
        display: none;
      }

      .lazy-image-modal__button {
        width: 36px;
        height: 36px;
        position: fixed;
        right: 10px;
        top: 10px;
        z-index: 1;
        display: grid;
        place-items: center;
        border-radius: 50%;
        pointer-events: auto;
        cursor: default;
        transition: 0.3s background-color ease-out;

        @media (hover: hover) {
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }

      .lazy-image-modal__button svg {
        width: 20px;
        height: 20px;
      }

      .lazy-image-modal__image {
        display: block;
        max-width: 100%;
        width: auto;
        height: auto;
      }

      [data-theme="dark"] dialog.lazy-image-modal {
        --v-backdrop: rgba(0, 0, 0, 0.3);
      }

      :root:has(dialog.lazy-image-modal:modal) {
        cursor: zoom-out;
      }
    `;
  document.head.appendChild(element);
};

const showModal = ({
  id,
  button,
  context,
  src,
  width,
  height,
  alt,
}: {
  id: string;
  button: HTMLElement;
  context: HTMLElement;
  src: string;
  width: number;
  height: number;
  alt: string;
}) => {
  const dialog = document.createElement('dialog');
  dialog.className = 'lazy-image-modal';
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', id);
  dialog.setAttribute('closedby', 'any');

  const content = document.createElement('div');
  content.className = 'lazy-image-modal__content';
  dialog.appendChild(content);

  const originSizeImage = document.createElement('img');
  originSizeImage.className = 'lazy-image-modal__image';
  originSizeImage.src = src;
  originSizeImage.alt = '';
  originSizeImage.width = width;
  originSizeImage.height = height;
  content.appendChild(originSizeImage);
  document.body.appendChild(dialog);

  const caption = document.createElement('p');
  caption.id = id;
  caption.className = 'lazy-image-modal__caption';
  caption.textContent = `図${id.split('-').slice(-1)[0]}${alt ? `: ${alt}` : ''}`;
  content.appendChild(caption);

  const show = () => {
    if (!('startViewTransition' in document)) {
      dialog.showModal();
      return;
    }

    originSizeImage.style.visibility = 'hidden';
    // 画像のデコードが完了していないとガタつく場合がある
    originSizeImage.decode().then(() => {
      dialog.showModal();

      context.style.viewTransitionName = id;
      document.startViewTransition(() => {
        context.style.removeProperty('view-transition-name');
        originSizeImage.style.removeProperty('visibility');
        originSizeImage.style.viewTransitionName = id;
      });
    });
  };

  const close = () => {
    if (!('startViewTransition' in document)) {
      dialog.close();
      dialog.remove();
      button.focus();
      return;
    }

    originSizeImage.style.viewTransitionName = id;
    document
      .startViewTransition(() => {
        originSizeImage.style.removeProperty('view-transition-name');
        context.style.viewTransitionName = id;
        dialog.close();
      })
      .finished.then(() => {
        context.style.removeProperty('view-transition-name');
        dialog.remove();
        button.focus();
      });
  };

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'lazy-image-modal__button';
  closeButton.insertAdjacentHTML(
    'beforeend',
    `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="閉じる">
      <line x1="6" y1="6" x2="18" y2="18" stroke="black" stroke-width="4" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="18" y2="6" stroke="black" stroke-width="4" stroke-linecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="18" y2="6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  );
  closeButton.addEventListener('click', close);
  dialog.appendChild(content);
  dialog.appendChild(closeButton);

  show();

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
};

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

    get controls() {
      return typeof this.getAttribute('controls') === 'string';
    }
    set controls(value: boolean) {
      if (value) {
        this.setAttribute('controls', '');
      } else {
        this.removeAttribute('controls');
      }
    }

    connectedCallback() {
      const self = this;
      const { src, width, height, alt, controls } = self;

      if (!src || !self.shadowRoot) return;

      const img = document.createElement('img');
      const shadowRoot = self.shadowRoot;

      if (width && height) {
        const style = new CSSStyleSheet();

        img.width = width;
        img.height = height;
        style.replaceSync(
          `
          :host {
            display: block;
            position: relative;
          }

          :host button {
            position: absolute;
            width: 100%;
            height: 100%;
            inset: 0;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding: 0.5em;
            border: none;
            background: none;
            cursor: zoom-in;
            margin: 0 auto;

            &:focus {
              outline: 0;
              box-shadow: none;
            }

            svg {
              width: 20px;
              height: 20px;
              padding: 8px;
              border-radius: 50%;
            }
          }

          :host img {
            display: block;
            max-width: 100%;
            height: auto;
            margin: 0 auto;
            transition: 0.3s opacity ease-out;

            @starting-style {
              opacity: 0;
            }
          }

          :host(lazy-image[loading]),
          :host(lazy-image[loading]) img {
            opacity: 0;
            visibility: hidden;
          }

          :focus-visible svg {
            outline: 2px solid var(--v-color-text-link, #fff);
            outline-offset: var(--v-outline-offset, 2px);
            box-shadow: 0 0 0 2px var(--v-color-background-secondary);
          }
          `,
        );
        shadowRoot.adoptedStyleSheets = [style];
      }

      const id = `lazy-image-${++lazyImageCounter}`;
      const index = lazyImageCounter;

      img.alt = `${alt ? `図${index}：${alt}` : `図${index}`}`;
      img.width = width;
      img.height = height;
      img.src = src;
      self.loading = true;
      shadowRoot.textContent = '';
      shadowRoot.appendChild(img);

      img.decode().then(() => {
        self.loading = false;

        if (controls) {
          const button = document.createElement('button');

          button.type = 'button';
          button.insertAdjacentHTML(
            'beforeend',
            `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="図${index}を拡大表示">
              <circle cx="10" cy="10" r="6" stroke="black" stroke-width="5"/>
              <line x1="10" y1="6.5" x2="10" y2="13.5" stroke="black" stroke-width="5" stroke-linecap="round"/>
              <line x1="6.5" y1="10" x2="13.5" y2="10" stroke="black" stroke-width="5" stroke-linecap="round"/>
              <line x1="14.5" y1="14.5" x2="18.5" y2="18.5" stroke="black" stroke-width="5" stroke-linecap="round"/>

              <circle cx="10" cy="10" r="6" stroke="white" stroke-width="1.5"/>
              <line x1="10" y1="6.5" x2="10" y2="13.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="6.5" y1="10" x2="13.5" y2="10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="14.5" y1="14.5" x2="18.5" y2="18.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          `,
          );
          button.addEventListener('click', () => {
            showModal({
              id,
              button,
              context: self,
              src,
              width: img.naturalWidth,
              height: img.naturalHeight,
              alt,
            });
          });

          injectModalStyles();
          shadowRoot.appendChild(button);
        }
      });
    }
  }

  customElements.define('lazy-image', LazyImage);
};
