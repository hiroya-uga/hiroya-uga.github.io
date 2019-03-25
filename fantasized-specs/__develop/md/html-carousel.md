# Carousels

## Fantasized Draft, ${LastUpdate}

<dl>
<dt>This version:</dt>
<dd><a href="https://hiroyau.ga/fantasized-specs/html-carousel.html">https://hiroyau.ga/fantasized-specs/html-carousel.html</a></dd>
<dt>Editors:</dt>
<dd><a href="https://github.com/hiroya-u">Hiroya-u</a></dd>
<dt>Issue Tracking:</dt>
<dd><a href="https://github.com/hiroya-u/hiroya-u.github.io/blob/master/fantasized-specs/html-carousel.html">GitHub Issues</a></dd>
</dl>


## Abstract

This specification defines a mechanism for bringing standard accessibility to carousels (sometimes referred to as *slider*).

[TOC]


## 1. Introduction

Carousel is a widget that has a lot of problems (mostly related to accessibility) in spite of high demand.

By standardizing the concept and interface of carousel widget as an element, we hope that issues such as accessibility and performance will be resolved.

## 2. Concepts

## 3. API

### 3.1. Related elements

#### 3.1.1. The `carousel` element

<div class="element">
<dl>
<dt><a href="https://www.w3.org/TR/html52/dom.html#categories">Categories</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">Flow content</a>.</dd>
<dd><a href="https://www.w3.org/TR/html52/dom.html#interactive-content-2">Interactive content</a>.</dd>
<dd><a href="https://www.w3.org/TR/html52/dom.html#palpable-content-2">Palpable content</a>.</dd>
<dd><a href="https://www.w3.org/TR/html52/sec-forms.html#labelable-element">Labelable</a>.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#contexts-in-which-this-element-can-be-used">Contexts in which this element can be used</a>:</dt>
<dd>Where <a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">flow content</a> is expected.</dd>

<dt><a data-link-type="dfn" href="https://www.w3.org/TR/html52/dom.html#content-model">Content model</a>:</dt>
<dd>Zero or more <code class="element">slide</code> elements</a>, then, <a href="https://www.w3.org/TR/html52/dom.html#transparent">transparent</a>.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#tag-omission-in-text-html">Tag omission in text/html</a>:</dt>
<dd>Neither tag is omissible</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#content-attributes">Content attributes</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#global-attributes-2">Global attributes</a></dd>
<dd><code>current</code> - Number the current index.</dd>
<dd><code>autoplay</code> - Hint that the carousel can be slide automatically when the page is loaded.</dd>
<dd><code>loop</code> - Whether to loop the slides.</dd>
<dd><code>controls</code> - Show user agent controls.</dd>
<dd><code>direction</code> - Direction the slider.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-role-attribute-values">Allowed ARIA role attribute values</a>:</dt>
<dd><code>carousel</code></dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-state-and-property-attributes">Allowed ARIA state and property attributes</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#global-aria--attributes">Global aria-* attributes</a></dd>
<dd>Any <code>aria-*</code> attributes <a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-roles-states-and-properties">applicable to the allowed roles</a>.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#dom-interface">DOM interface</a>:</dt>
<dd class="interface">
<pre><code class="idl"><span class="keyword">interface</span> <span class="name">HTMLCarouselElement</span> : <a href="https://www.w3.org/TR/html52/dom.html#htmlelement">HTMLElement</a> {
  <span class="keyword">attribute</span> <a href=""><span class="keyword">boolean</span></a> autoplay;
  <span class="keyword">attribute</span> <a href=""><span class="keyword">boolean</span></a> controls;
  <span class="keyword">attribute</span> <a href=""><span class="keyword">unsigned long</span></a> current;
  <span class="keyword">attribute</span> <a href=""><span class="keyword">DOMString</span></a> direction;
  <span class="keyword">attribute</span> <a href=""><span class="keyword">boolean</span></a> loop;<br>
  <span class="keyword">void</span> play();
  <span class="keyword">void</span> pause();
};</code></pre>
</dd>
</dl>
</div>

The <code class="element">carousel</code> element represents a carousel widget that can combine multiple pieces of content into a compact display.

The <dfn><code>current</code></dfn> attribute represent initial current position. If the `current` attribute is present, user agents must [parse it as an integer](https://www.w3.org/TR/html52/infrastructure.html#parse-token-as-an-integer), in order to determine the attribute’s value.  The default value is 1.

The <dfn><code>autoplay</code></dfn> attribute is a [boolean attribute](https://www.w3.org/TR/html52/infrastructure.html#boolean-attribute). When present, the user agent will automatically begin slide of the carousel as soon.

The `autoplay` IDL attribute must [reflect](https://www.w3.org/TR/html52/infrastructure.html#reflection) the content attribute of the same name.

The <dfn><code>loop</code></dfn> attribute is a [boolean attribute](https://www.w3.org/TR/html52/infrastructure.html#boolean-attribute) that, if specified, indicates that the slide of carousel element is to seek back to the start of the slide upon reaching the end.

The `loop` IDL attribute must reflect the content attribute of the same name.

The <dfn>`controls`</dfn> attribute is a [boolean attribute](https://www.w3.org/TR/html52/infrastructure.html#boolean-attribute) that, if specified, it indicates that the author has not provided a scripted controller and would like the user agent to provide its own set of controls.

If the attribute is present, or if scripting is disabled for the media element, then the user agent should **expose a user interface to the user**. This user interface should include features the pager buttons (next, prev), begin button for autoplay, pause button, and dot-Indicator for toggle to arbitrary slide in the carousel. Other controls may also be made available.

Even when the attribute is absent, however, user agents may provide controls to use of the carousel (e.g., swipe, keyboard interface), but such features should not interfere with the page’s normal rendering.  The user agent may implement this simply by [exposing a user interface to the user](https://www.w3.org/TR/html52/semantics-embedded-content.html#exposing-a-user-interface) as if the `controls` attribute was present.

If the user agent exposes a user interface to the user by displaying controls over the media element, then the user agent should suppress any user interaction events while the user agent is interacting with this interface. (For example, if the user clicks on a carousel's pager control, `mousedown` events and so forth would not simultaneously be fired at elements on the page.)

Where possible (specifically, for toggling slide, and for toggling autoplay), user interface features exposed by the user agent must be implemented in terms of the DOM API described above, so that, e.g., all the same events fire.

The `controls` IDL attribute must reflect the content attribute of the same name.

The <dfn>`direction`</dfn> attribute controls the slide direction of the <code class="element">carousel</code>. It is an [enumerated attribute](https://www.w3.org/TR/html52/infrastructure.html#enumerated-attributes) with the following keywords .

- `left` - Slide left (right is next content)
- `right` - Slide right (left is next content)
- `up` - Slide up (bottom is next content)
- `down` - Slide down (top is next content)

The missing value default is the `left` state.

<div class="note">

If possible, the <code class="element">carousel</code> needs a label (accessible name) by `title` attribute or `aria-label` attribute etc. If omitted, assistive technology is expected to simply speak this element as a "carousel".

</div>

<div class="example">

The following example shows the carousel element being used to show 3 slide of 5 slide at once.

```html
<style>
#carousel {
  slide-width: 33%;
}
</style>

<carousel id="carousel">
<slide>First slide</slide>
<slide>Second slide</slide>
<slide>Third slide</slide>
<slide>Forth slide</slide>
<slide>Fifth slide</slide>

<p>This browser does not seem to support carousel elements.</p>
</carousel>
```

</div>

<div class="example">

The following example shows the carousel element being used to show 1 to 3 slide of 5 slide at once. Adjustment of the number of display uses CSS.

This carousel has a controller displayed, it slide to the right, and the initial current position is the second one. The carousel is autoplayed at the same time as the page is loaded, and the slide loops.

```html
<style>
#carousel {
  slide-width: minmax(200px, 33%);
  slide-delay: 3s;
  slide-duration: .2s;
  slide-timing-function: ease-out;
}
</style>

<carousel id="carousel" controls current="2" autoplay direction="right" loop>
<slide>First slide</slide>
<slide>Second slide</slide>
<slide>Third slide</slide>
<slide>Forth slide</slide>
<slide>Fifth slide</slide>

<p>This browser does not seem to support carousel elements.</p>
</carousel>
```

</div>

#### 3.1.2 The `slide` element

<div class="element">
<dl>
<dt><a href="https://www.w3.org/TR/html52/dom.html#categories">Categories</a>:</dt>
<dd>None.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#contexts-in-which-this-element-can-be-used">Contexts in which this element can be used</a>:</dt>
<dd>Inside <code class="element">carousel</code> elements.</dd>

<dt><a data-link-type="dfn" href="https://www.w3.org/TR/html52/dom.html#content-model">Content model</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">Flow content</a>.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#tag-omission-in-text-html">Tag omission in text/html</a>:</dt>
<dd>Neither tag is omissible</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#content-attributes">Content attributes</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#global-attributes-2">Global attributes</a></dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-role-attribute-values">Allowed ARIA role attribute values</a>:</dt>
<dd>None</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#allowed-aria-state-and-property-attributes">Allowed ARIA state and property attributes</a>:</dt>
<dd>None</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#dom-interface">DOM interface</a>:</dt>
<dd>Uses <a href="https://www.w3.org/TR/html52/dom.html#htmlelement"><code> HTMLElement</code></a>.</dd>
</dl>
</div>


### 3.2. Interfaces


#### 3.2.1 Swipe


#### 3.2.2 Keyboard


### 3.3. CSS Selectors
