'use client';

export const AccesskeyValuesAsNumbers = () => {
  return (
    <nav>
      <a href="http://www.pauljadam.com" accessKey="1" hrefLang="en-US">
        Home
      </a>
      <a href="http://www.pauljadam.com/demos.html" accessKey="2" hrefLang="en-US">
        Demos
      </a>
      <a href="http://www.pauljadam.com/resources.html" accessKey="3" hrefLang="en-US">
        Resources
      </a>
      <a href="http://www.pauljadam.com/extension.html" accessKey="4" hrefLang="en-US">
        a11yTools
      </a>
      <a href="http://www.pauljadam.com/bookmarklets.html" accessKey="5" hrefLang="en-US">
        Bookmarklets
      </a>
      <a href="http://www.pauljadam.com/contact.php" accessKey="6" hrefLang="en-US">
        Contact
      </a>
      <br />
      <br />
      <button
        onClick={() => alert('ナビゲーションメニューボタンは有効です')}
        accessKey="0"
        aria-label="ナビゲーションメニュー"
        aria-expanded="false"
      >
        ☰
      </button>
    </nav>
  );
};

export const AccesskeyValuesAsLetters = () => {
  return (
    <nav>
      <a href="http://www.pauljadam.com" accessKey="H" hrefLang="en-US">
        Home
      </a>
      <a href="http://www.pauljadam.com/demos.html" accessKey="D" hrefLang="en-US">
        Demos
      </a>
      <a href="http://www.pauljadam.com/resources.html" accessKey="R" hrefLang="en-US">
        Resources
      </a>
      <a href="http://www.pauljadam.com/extension.html" accessKey="A" hrefLang="en-US">
        a11yTools
      </a>
      <a href="http://www.pauljadam.com/bookmarklets.html" accessKey="B" hrefLang="en-US">
        Bookmarklets
      </a>
      <a href="http://www.pauljadam.com/contact.php" accessKey="C" hrefLang="en-US">
        Contact
      </a>
      <br />
      <br />
      <button
        onClick={() => alert('Navigation Menu Button Activated.')}
        accessKey="N"
        aria-label="Navigation Menu"
        aria-expanded="false"
      >
        ☰
      </button>
    </nav>
  );
};
