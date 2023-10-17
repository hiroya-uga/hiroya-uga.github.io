export const DescriptionTable = () => {
  return (
    <div className="element">
      <dl>
        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#categories">Categories</a>:
        </dt>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">Flow content</a>.
        </dd>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#embedded-content-category">Embedded content</a>.
        </dd>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#interactive-content-2">Interactive content</a>.
        </dd>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#palpable-content-2">Palpable content</a>.
        </dd>
        <dd>
          <a href="https://www.w3.org/TR/html52/sec-forms.html#labelable-element">Labelable</a>.
        </dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#contexts-in-which-this-element-can-be-used">
            Contexts in which this element can be used
          </a>
          :
        </dt>
        <dd>
          Where <a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">flow content</a> is expected.
        </dd>

        <dt>
          <a data-link-type="dfn" href="https://www.w3.org/TR/html52/dom.html#content-model">
            Content model
          </a>
          :
        </dt>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">Flow content</a> other than{' '}
          <a href="https://www.w3.org/TR/html5/dom.html#text-content">text</a> and{' '}
          <a href="https://www.w3.org/TR/html52/syntax.html#void-elements">void elements</a>.
        </dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#tag-omission-in-text-html">Tag omission in text/html</a>:
        </dt>
        <dd>Neither tag is omissible</dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#content-attributes">Content attributes</a>:
        </dt>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#global-attributes-2">Global attributes</a>
        </dd>
        <dd>
          <code>autoplay</code> - Hint that the carousel can be slide automatically when the page is loaded.
        </dd>
        <dd>
          <code>controls</code> - Show user agent controls.
        </dd>
        <dd>
          <code>current</code> - Number the current index.
        </dd>
        <dd>
          <code>direction</code> - Direction the slider.
        </dd>
        <dd>
          <code>loop</code> - Whether to loop the slides.
        </dd>
        <dd>
          <code>type</code> - Slide animation type of carousel.
        </dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-role-attribute-values">
            Allowed ARIA role attribute values
          </a>
          :
        </dt>
        <dd>
          <code>carousel</code>
        </dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-state-and-property-attributes">
            Allowed ARIA state and property attributes
          </a>
          :
        </dt>
        <dd>
          <a href="https://www.w3.org/TR/html52/dom.html#global-aria--attributes">Global aria-* attributes</a>
        </dd>
        <dd>
          Any <code>aria-*</code> attributes{' '}
          <a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-roles-states-and-properties">
            applicable to the allowed roles{' '}
          </a>
          .
        </dd>

        <dt>
          <a href="https://www.w3.org/TR/html52/dom.html#dom-interface">DOM interface</a>:
        </dt>
        <dd className="interface">
          <pre>
            <code className="idl">
              <span className="keyword">interface</span> <span className="name">HTMLCarouselElement</span> :{' '}
              <a href="https://www.w3.org/TR/html52/dom.html#htmlelement">HTMLElement</a> &#x7b;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">boolean</span>
              </a>{' '}
              autoplay;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">boolean</span>
              </a>{' '}
              controls;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">unsigned long</span>
              </a>{' '}
              current;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">DOMString</span>
              </a>{' '}
              direction;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">boolean</span>
              </a>{' '}
              loop;
              <br />
              <span className="keyword">attribute</span>{' '}
              <a href="">
                <span className="keyword">DOMString</span>
              </a>{' '}
              type;
              <br />
              <span className="keyword">void</span> play();
              <span className="keyword">void</span> pause(); &#x7d;;
            </code>
          </pre>
        </dd>
      </dl>
    </div>
  );
};
