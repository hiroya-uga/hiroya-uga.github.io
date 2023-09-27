import '@/app/(common)/documents/translations/pauljadam-modern-web-a11y-demos/common.css';
import { Footer } from '@/components/structures/Footer/Footer';

import type { Metadata } from 'next';

export default function Page() {
  const base = '/documents/translations/pauljadam-modern-web-a11y-demos';

  return (
    <>
      <header className="py-8 sm:py-16 px-4 sm:pl-10 mb-4">
        <div className="max-w-[960px] mx-auto">
          <p>
            <a href="../">../</a>
          </p>
        </div>
      </header>

      <main className="px-4 sm:pl-10">
        <div className="max-w-[960px] mx-auto">
          <h1>日本語訳：PaulJAdam's Modern Web Accessibility Demos</h1>

          <p>
            原文：<a href="http://www.pauljadam.com/demos/">PaulJAdam's Modern Web Accessibility Demos</a>
          </p>

          <ul>
            <li>
              <a href={`${base}/a11y-gone-wrong`}>a11y-gone-wrong.html</a>
            </li>
            <li>
              <a href={`${base}/abbr`}>abbr.html</a>
            </li>
            <li>
              <a href={`${base}/accesskey`}>accesskey.html</a>
            </li>
            <li>
              <a href={`${base}/accessiblenameimg`}>accessiblenameimg.html</a>
            </li>
            <li>
              <a href={`${base}/csunmobile-accordion-bad`}>accordion-bad.html</a>
            </li>
            <li>
              <a href={`${base}/csunmobile-accordion-aria`}>accordion-aria.html</a>
            </li>
            <li>
              <a href={`${base}/accordion-heading`}>accordion-heading.html</a>
            </li>
            <li>
              <a href={`${base}/accounting-tables`}>accounting-tables.html</a>
            </li>
            <li>
              <a href={`${base}/alerttimer`}>alerttimer.html</a>
            </li>
            <li>
              <a href={`${base}/altbgimg`}>altbgimg.html</a>
            </li>
            <li>
              <a href={`${base}/annotated-tables`}>annotated-tables.html</a>
            </li>
            <li>
              <a href={`${base}/apple-system-css-font`}>apple-system-css-font.html</a>
            </li>
            <li>
              <a href={`${base}/aria-alert-assertive-validation`}>aria-alert-assertive-validation.html</a>
            </li>
            <li>
              <a href={`${base}/aria-alert-validation`}>aria-alert-validation.html</a>
            </li>
            <li>
              <a href={`${base}/aria-atomic-relevant`}>aria-atomic-relevant.html</a>
            </li>
            <li>
              <a href={`${base}/aria-describedby-labelledby-link-purpose`}>
                aria-describedby-labelledby-link-purpose.html
              </a>
            </li>
            <li>
              <a href={`${base}/aria-describedby-validation`}>aria-describedby-validation.html</a>
            </li>
            <li>
              <a href={`${base}/aria-expanded`}>aria-expanded.html</a>
            </li>
            <li>
              <a>aria-haspopup.html</a>
            </li>
            <li>
              <a href={`${base}/aria-hidden`}>aria-hidden.html</a>
            </li>
            <li>
              <a href={`${base}/aria-invalid`}>aria-invalid.html</a>
            </li>
            <li>
              <a href={`${base}/aria-labelledby`}>aria-labelledby.html</a>
            </li>
            <li>
              <a href={`${base}/aria-live-slider`}>aria-live-slider.html</a>
            </li>
            <li>
              <a href={`${base}/aria-menubar`}>aria-menubar.html</a>
            </li>
            <li>
              <a href={`${base}/aria-pressed`}>aria-pressed.html</a>
            </li>
            <li>
              <a>aria-role-alertdialog-setTimeout.html</a>
            </li>
            <li>
              <a>aria-role-alertdialog.html</a>
            </li>
            <li>
              <a>aria-role-tooltip.html</a>
            </li>
            <li>
              <a>aria-roledescription.html</a>
            </li>
            <li>
              <a>aria-table.html</a>
            </li>
            <li>
              <a>aria-tabpanel.html</a>
            </li>
            <li>
              <a href={`${base}/ariacountdown`}>ariacountdown.html</a>
            </li>
            <li>
              <a>audio-slider.html</a>
            </li>
            <li>
              <a>autofocusvstabindex.html</a>
            </li>
            <li>
              <a href={`${base}/autoplay-loop-muted-controls`}>autoplay-loop-muted-controls.html</a>
            </li>
            <li>
              <a href={`${base}/badav`}>badav.html</a>
            </li>
            <li>
              <a href={`${base}/bootstrap-dropdown`}>bootstrap-dropdown.html</a>
            </li>
            <li>
              <a>button.html</a>
            </li>
            <li>
              <a href={`${base}/buttons`}>buttons.html</a>
            </li>
            <li>
              <a>canvas.html</a>
            </li>
            <li>
              <a href={`${base}/checkbox`}>checkbox.html</a>
            </li>
            <li>
              <a>contact-before.html</a>
            </li>
            <li>
              <a>contact-after-aria.html</a>
            </li>
            <li>
              <a>contact-after-html5.html</a>
            </li>
            <li>
              <a href={`${base}/css-content-new-window`}>css-content-new-window.html</a>
            </li>
            <li>
              <a>css-line-through-del-ins-accessibility.html</a>
            </li>
            <li>
              <a>css3speech.html</a>
            </li>
            <li>
              <a href={`${base}/css4altgeneratedcontent`}>css4altgeneratedcontent.html</a>
            </li>
            <li>
              <a>csstext.html</a>
            </li>
            <li>
              <a>customcontrols.html</a>
            </li>
            <li>
              <a>dates.html</a>
            </li>
            <li>
              <a>data-tables.html</a>
            </li>
            <li>
              <a href={`${base}/detail-message-dialog`}>detail-message-dialog.html</a>
            </li>
            <li>
              <a>details-summary.html</a>
            </li>
            <li>
              <a href={`${base}/dialog`}>dialog.html</a>
            </li>
            <li>
              <a>dialog-DOM.html</a>
            </li>
            <li>
              <a>draggable.html</a>
            </li>
            <li>
              <a href={`${base}/empty-headings`}>empty-headings.html</a>
            </li>
            <li>
              <a href={`${base}/fake-button`}>fake-button.html</a>
            </li>
            <li>
              <a>focus-after-page-load.html</a>
            </li>
            <li>
              <a href={`${base}/figure-figcaption`}>figure-figcaption.html</a>
            </li>
            <li>
              <a>form-bad.html</a>
            </li>
            <li>
              <a>form-aria.html</a>
            </li>
            <li>
              <a>form-html5.html</a>
            </li>
            <li>
              <a>form-errors-top.html</a>
            </li>
            <li>
              <a>fieldsetlegend.html</a>
            </li>
            <li>
              <a>focusvisible.html</a>
            </li>
            <li>
              <a href={`${base}/goodav`}>goodav.html</a>
            </li>
            <li>
              <a>hamburger-menu.html</a>
            </li>
            <li>
              <a>headings.html</a>
            </li>
            <li>
              <a>highlights.html</a>
            </li>
            <li>
              <a>html5-input-types.html</a>
            </li>
            <li>
              <a>html5-placeholder-contrast.html</a>
            </li>
            <li>
              <a>html5-structural.html</a>
            </li>
            <li>
              <a>html5-video-a11y.html</a>
            </li>
            <li>
              <a>iframe.html</a>
            </li>
            <li>
              <a>iframe-voiceover-scrolling-bug.html</a>
            </li>
            <li>
              <a>imageAndTextLink.html</a>
            </li>
            <li>
              <a>img.html</a>
            </li>
            <li>
              <a>inpagelinks.html</a>
            </li>
            <li>
              <a>inputSubmitTitle.html</a>
            </li>
            <li>
              <a>ios8bugs.html</a>
            </li>
            <li>
              <a>iosvocheatsheet.html</a>
            </li>
            <li>
              <a>jaws-ie-tabindex-bug.html</a>
            </li>
            <li>
              <a>jsalertconfirmprompt.html</a>
            </li>
            <li>
              <a>jqueryui-autocomplete.html</a>
            </li>
            <li>
              <a>landmarks.html</a>
            </li>
            <li>
              <a>layout-table-role-presentation.html</a>
            </li>
            <li>
              <a>linkpurpose.html</a>
            </li>
            <li>
              <a>loading-indicator.html</a>
            </li>
            <li>
              <a>mathml.html</a>
            </li>
            <li>
              <a>missingfieldsetlegend.html</a>
            </li>
            <li>
              <a>mobilechecklist.html</a>
            </li>
            <li>
              <a>mobileforma11y.html</a>
            </li>
            <li>
              <a>multithumb-slider.html</a>
            </li>
            <li>
              <a>numericRanges.html</a>
            </li>
            <li>
              <a>obstacle-course.html</a>
            </li>
            <li>
              <a>parsing.html</a>
            </li>
            <li>
              <a>positionbug.html</a>
            </li>
            <li>
              <a>positivetabindexfail.html</a>
            </li>
            <li>
              <a>progressbar.html</a>
            </li>
            <li>
              <a>quad.html</a>
            </li>
            <li>
              <a>repeating-buttons-accessibilty.html</a>
            </li>
            <li>
              <a>remove-filter-buttons.html</a>
            </li>
            <li>
              <a>rolegroup.html</a>
            </li>
            <li>
              <a>role-alert.html</a>
            </li>
            <li>
              <a>rwd-aria-menu-button.html</a>
            </li>
            <li>
              <a>rwd-aria-menubar.html</a>
            </li>
            <li>
              <a>rwd-tabs-accordion.html</a>
            </li>
            <li>
              <a>rwdstate.html</a>
            </li>
            <li>
              <a>section.html</a>
            </li>
            <li>
              <a>select.html</a>
            </li>
            <li>
              <a>select-android.html</a>
            </li>
            <li>
              <a>select-option.html</a>
            </li>
            <li>
              <a>semanticelements.html</a>
            </li>
            <li>
              <a>semanticmobile.html</a>
            </li>
            <li>
              <a>session-timeout-alertdialog.html</a>
            </li>
            <li>
              <a>spa-focus.html</a>
            </li>
            <li>
              <a>svg.html</a>
            </li>
            <li>
              <a>svg-bar-chart.html</a>
            </li>
            <li>
              <a>svg-line-chart.html</a>
            </li>
            <li>
              <a>tableA11yTest.html</a>
            </li>
            <li>
              <a>talkbackcheatsheet.html</a>
            </li>
            <li>
              <a>timeout.html</a>
            </li>
            <li>
              <a>title-aria-label.html</a>
            </li>
            <li>
              <a>title-keyboard.html</a>
            </li>
            <li>
              <a>tooltip.html</a>
            </li>
            <li>
              <a>underlines.html</a>
            </li>
            <li>
              <a>voiceover-clickable.html</a>
            </li>
            <li>
              <a>voiceover-ios-html-aria-support.html</a>
            </li>
            <li>
              <a>voiosmultifocusbug.html</a>
            </li>
            <li>
              <a>web-speech-api.html</a>
            </li>
            <li>
              <a>youtubeHTML5embed.html</a>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const metadata: Metadata = {
  title: "日本語訳：PaulJAdam's Modern Web Accessibility Demos",
  description: 'Generated by create next app',
};
