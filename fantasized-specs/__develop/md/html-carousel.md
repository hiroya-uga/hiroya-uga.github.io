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
<dd><a href="https://www.w3.org/TR/html52/dom.html#flow-content-2">Flow content</a> other than <a href="https://www.w3.org/TR/html5/dom.html#text-content">text</a> and <a href="https://www.w3.org/TR/html52/syntax.html#void-elements">void elements</a>.</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#tag-omission-in-text-html">Tag omission in text/html</a>:</dt>
<dd>Neither tag is omissible</dd>

<dt><a href="https://www.w3.org/TR/html52/dom.html#content-attributes">Content attributes</a>:</dt>
<dd><a href="https://www.w3.org/TR/html52/dom.html#global-attributes-2">Global attributes</a></dd>
<dd><code>autoplay</code> - Hint that the carousel can be slide automatically when the page is loaded.</dd>
<dd><code>controls</code> - Show user agent controls.</dd>
<dd><code>current</code> - Number the current index.</dd>
<dd><code>direction</code> - Direction the slider.</dd>
<dd><code>loop</code> - Whether to loop the slides.</dd>
<dd><code>type</code> - Slide animation type of carousel.</dd>

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
  <span class="keyword">attribute</span> <a href=""><span class="keyword">boolean</span></a> loop;
  <span class="keyword">attribute</span> <a href=""><span class="keyword">DOMString</span></a> type;<br>
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

The <dfn>`direction`</dfn> attribute controls the swipe direction of the <code class="element">carousel</code>. It is an [enumerated attribute](https://www.w3.org/TR/html52/infrastructure.html#enumerated-attributes) with the following keywords .

- `left` - Slide left (right is next content)
- `right` - Slide right (left is next content)
- `up` - Slide up (bottom is next content)
- `down` - Slide down (top is next content)

The missing value default is the `left` state.

The <dfn>`type`</dfn> attribute switches the animation type when the carousel slides. It is an [enumerated attribute](https://www.w3.org/TR/html52/infrastructure.html#enumerated-attributes) with the following keywords .

- `slide` - Slide animation only
- `fade` - Fade in and fade out (without slide animation)
- `fadeslide` - Fade in and fade out while slide animation
- `crossdissolve` - Cross dissolve
<!-- - `coververtical` - Slide up animation -->
<!-- - `fliphorizontal` - Turn over in the horizontal direction animation -->

The missing value default is the `slide` state.

Also, the `title` attribute has special semantics on this element.

<div class="note">

If possible, the <code class="element">carousel</code> needs a label (accessible name) by `title` attribute or `aria-label` attribute etc. If omitted, assistive technology is expected to simply speak this element as a "carousel".

</div>

All child elements of the `carousel` element are interpreted as <dfn>[`slides`](#3-1-2-the-::slide-pseudo-element)</dfn>. Browsers that do not support this element will simply looks like lined up the [flow contents](https://www.w3.org/TR/html52/dom.html#flow-content-2) of the child elements.

<div class="example">

The following example shows the carousel element being used to show 3 slide of 5 slide at once.

```html
<style>
#carousel::slide {
  width: 33%;
}
</style>

<carousel id="carousel">
<div>First slide</div>
<div>Second slide</div>
<div>Third slide</div>
<div>Forth slide</div>
<div>Fifth slide</div>
</carousel>
```

</div>

<div class="example">

The following example shows the carousel element being used to show 1 to 3 slide of 5 slide at once. Adjustment of the number of display uses CSS.

This carousel has a controller displayed, it slide to the right, animation type is fadeslide and the initial current position is the second one. The carousel is autoplayed at the same time as the page is loaded, and the slide loops.

```html
<style>
#carousel::slide {
  min-width: 200px;
  max-width: 33%;
  transition-delay: 3s;
  transition-duration: .2s;
  transition-timing-function: ease-out;
}
</style>

<carousel type="fadeslide" id="carousel" controls current="2" autoplay direction="right" loop>
<div>First slide</div>
<div>Second slide</div>
<div>Third slide</div>
<div>Forth slide</div>
<div>Fifth slide</div>
</carousel>
```

</div>

#### 3.1.2. The ::slide pseudo-element

The <dfn><code class="selector">::slide</code></dfn> pseudo-element is produced based on the <code class="element">carousel</code> element's child elements.

<div class="example">

This pseudo-element selector can be used to style carousel slides.

For example, the `width` property of the pseudo-element represents the width of one slide of the carousel. 

If the width is 33.3333%, the <code class="element">carousel</code> element is expected to be drawn in 3 columns. If it is 70%, it is expected that one slide will be drawn in the center and 15% of the previous and next slides of the same width will be drawn on the left and right.

In addition, if the <code class="element">carousel</code> element has not `loop` attribute, it is expected that the previous slide when the slide is not advancing and the next slide when the slide is advanced to end are not drawn.

```css
carousel::slide {
  width: 33%;
}
```

In addition, the slide animation of the <code class="element">carousel</code> element uses [CSS Transitions](https://www.w3.org/TR/css-transitions/). The author is able to adjust slide animation by overriding the relevant properties.

```css
carousel::slide {
  transition-delay: 3s;
  transition-duration: .2s;
  transition-timing-function: ease-out;
}
```

However, if you override the `transition-property` value specified by the user agent by default, the carousel will not animate when sliding. Conversely, if you want to disable animation for any reason, you can do so by specifying `transition-property` as `none`.

</div>

<div class="example">

In browsers that support the <code class="element">carousel</code> elements, selectors such as <code class="selector">carousel > div</code> and <code class="selector"> carousel > * </code> do not target slides in the <code class="element">carousel</code> elements.

```css
carousel::slide { /* for carousel supported browsers */
  min-width: 200px;
  max-width: 33%;
  transition-delay: 3s;
  transition-duration: .2s;
  transition-timing-function: ease-out;
}

carousel > * { /* for carousel not supported browsers */
  margin: 0 0 30px;
}
```

Note that CSS selectors for elements in slides do not need to use the <code class="selector">::slide</code> pseudo-element. It is more constructive not to use pseudo-element selectors.

```html
<style>
carousel div > p {
  /* ... */
}

carousel::slide > p { /* The targets of this rule set are same previous one. */
  /* ... */
}
</style>

<carousel>
<div><p>lorem ipsum...</p></div>
<div><p>lorem ipsum...</p></div>
<div><p>lorem ipsum...</p></div>
</carousel>
```
</div>


### 3.2. User interfaces


#### 3.2.1 Swipe


#### 3.2.2 Pager buttons


#### 3.2.3 Dots indicator


#### 3.2.4 Toggle button (autoplay / pause)


#### 3.2.5 Keyboard


### 3.3. CSS Selectors


### 3.4. Events