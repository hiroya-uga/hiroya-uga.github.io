if (/\/en(\/|$)/.test(globalThis.window.location.pathname)) {
  document.documentElement.lang = 'en';
}

try {
  const theme = JSON.parse(localStorage.getItem('theme') ?? 'null')?.value || 'light';
  document.documentElement.dataset.theme = theme;
} catch {}

try {
  document.documentElement.dataset.cookieConsent = 'waiting';

  const state = (() => {
    if (/googlebot|lighthouse|bingbot/i.test(navigator.userAgent)) {
      localStorage.setItem('cookie-consent', '{"type":"primitive","value":"rejected"}');
    }
    return JSON.parse(localStorage.getItem('cookie-consent') ?? 'null')?.value || 'waiting';
  })();

  if (state === 'waiting') {
    if (globalThis.window.location.search.includes('utm_medium=social')) {
      document.documentElement.dataset.cookieConsent = 'waiting-from-sns';
    }
    if (globalThis.window.location.pathname.endsWith('/en/')) {
      document.documentElement.dataset.cookieConsent = 'waiting-in-en';
    }
    if (globalThis.window.location.pathname === '/') {
      document.documentElement.dataset.cookieConsent = 'waiting-on-top';
    }
  } else {
    delete document.documentElement.dataset.cookieConsent;
  }
} catch {}
