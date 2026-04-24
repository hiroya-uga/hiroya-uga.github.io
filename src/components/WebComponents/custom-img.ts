import styleSheet from './custom-img.css?raw';

const ref = {
  customImageElementIndex: 0,
  lastPathName: '',
  imageList: [] as { src: string; width: number; height: number; alt: string }[],
  expandedIndex: -1,
};
const styleId = 'customされたimg要素ˆ-ˆのモーダル-styles';

const injectModalStyles = () => {
  const style = document.getElementById(styleId);
  if (style !== null) {
    return;
  }
  const element = document.createElement('style');
  element.id = styleId;
  element.textContent = styleSheet;
  document.head.appendChild(element);
};

const showModal = ({
  index,
  button,
  context,
  src,
  width,
  height,
  alt,
}: {
  index: number;
  button: HTMLElement;
  context: HTMLElement;
  src: string;
  width: number;
  height: number;
  alt: string;
}) => {
  const id = 'customされたimg要素ˆ-ˆのモーダルキャプション';
  const dialog = document.createElement('dialog');
  dialog.className = 'customされたimg要素ˆ-ˆのモーダル';
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', id);
  dialog.setAttribute('closedby', 'any');

  const content = document.createElement('div');
  content.className = 'customされたimg要素ˆ-ˆのモーダル__content';
  dialog.appendChild(content);

  const originSizeImage = document.createElement('img');
  const caption = document.createElement('p');
  caption.id = id;
  caption.className = 'customされたimg要素ˆ-ˆのモーダル__caption';
  caption.setAttribute('aria-live', 'polite');

  ref.expandedIndex = index - 1;

  const inject = (next: { src: string; width: number; height: number; alt: string }) => {
    originSizeImage.className = 'customされたimg要素ˆ-ˆのモーダル__image';
    originSizeImage.src = next.src;
    originSizeImage.alt = '';
    originSizeImage.width = next.width;
    originSizeImage.height = next.height;
    caption.textContent = `図${ref.expandedIndex + 1}${next.alt ? `: ${next.alt}` : ''}`;
  };

  inject({
    src,
    width,
    height,
    alt,
  });
  content.appendChild(originSizeImage);
  content.appendChild(caption);
  document.body.appendChild(dialog);

  const show = () => {
    if ('startViewTransition' in document === false) {
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
    if ('startViewTransition' in document === false) {
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

  const prevButton = document.createElement('button');
  const nextButton = document.createElement('button');
  const closeButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', '前の画像');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', '次の画像');
  closeButton.type = 'button';
  prevButton.className = 'customされたimg要素ˆ-ˆのモーダル__button of-prev';
  nextButton.className = 'customされたimg要素ˆ-ˆのモーダル__button of-next';
  closeButton.className = 'customされたimg要素ˆ-ˆのモーダル__button of-close';
  prevButton.textContent = '←';
  nextButton.textContent = '→';
  closeButton.insertAdjacentHTML(
    'beforeend',
    `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="閉じる" class="customされたimg要素ˆ-ˆのモーダル__svg">
      <line x1="6" y1="6" x2="18" y2="18" stroke="black" stroke-width="4" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="18" y2="6" stroke="black" stroke-width="4" stroke-linecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="18" y2="6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  );

  const buttonWrapper = document.createElement('p');
  buttonWrapper.className = 'customされたimg要素ˆ-ˆのモーダル__button-wrapper';

  prevButton.addEventListener('click', () => {
    ref.expandedIndex--;

    if (ref.imageList[ref.expandedIndex]) {
      inject({
        ...ref.imageList[ref.expandedIndex],
      });
      return;
    }

    ref.expandedIndex++;
  });
  nextButton.addEventListener('click', () => {
    ref.expandedIndex++;

    if (ref.imageList[ref.expandedIndex]) {
      inject({
        ...ref.imageList[ref.expandedIndex],
      });
      return;
    }

    ref.expandedIndex--;
  });

  buttonWrapper.appendChild(prevButton);
  buttonWrapper.appendChild(nextButton);
  dialog.appendChild(buttonWrapper);
  dialog.appendChild(closeButton);

  show();

  const onKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevButton.click();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextButton.click();
        break;

      default:
        break;
    }
  };

  window.addEventListener('keydown', onKeydown);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target === closeButton || e.target === originSizeImage) {
      e.preventDefault();
      close();
    }
  });
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    window.removeEventListener('keydown', onKeydown);
  });
};

export const CustomImage = () => {
  class CustomImageElement extends HTMLElement {
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

      if (src === '' || self.shadowRoot === null) {
        return;
      }

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
            width: fit-content;
            margin: 0 auto;
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
              width: 1.25rem;
              height: 1.25rem;
              padding: 8px;
              border-radius: 50%;
            }
          }

          :host img {
            display: block;
            max-width: 100%;
            height: auto;
            margin: 0 auto;
            transition: opacity 0.3s ease-out;

            @starting-style {
              opacity: 0;
            }
          }

          :host(customされたimg要素ˆ-ˆ[loading]),
          :host(customされたimg要素ˆ-ˆ[loading]) img {
            opacity: 0;
            visibility: hidden;
          }

          :focus-visible svg {
            outline: 2px solid var(--x-color-text-link, #fff);
            outline-offset: var(--x-outline-offset, 2px);
            box-shadow: 0 0 0 2px var(--x-color-background-secondary);
          }
          `,
        );
        shadowRoot.adoptedStyleSheets = [style];
      }

      if (ref.lastPathName !== window.location.pathname) {
        ref.customImageElementIndex = 0;
        ref.imageList = [];
        ref.lastPathName = window.location.pathname;
      }

      const customImageElementIndex = ++ref.customImageElementIndex;
      const id = `custom-img-${customImageElementIndex}`;
      const index = customImageElementIndex;

      img.alt = `${alt ? `図${index}：${alt}` : `図${index}`}`;
      img.width = width;
      img.height = height;
      img.src = src;
      self.loading = true;
      shadowRoot.textContent = '';
      shadowRoot.appendChild(img);

      const imageListIndex = ref.imageList.length;
      ref.imageList.push({ src, width: 0, height: 0, alt });

      img.decode().then(() => {
        self.loading = false;

        ref.imageList[imageListIndex] = {
          src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          alt,
        };

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
              index: customImageElementIndex,
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

  customElements.define('customされたimg要素ˆ-ˆ', CustomImageElement);
};
