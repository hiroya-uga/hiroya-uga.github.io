import { GA_MEASUREMENT_ID } from '@/constants/id';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import ReactGA from 'react-ga4';

export const sendPageview = () => {
  if (!ReactGA.isInitialized) {
    return;
  }

  ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
};

// 呼び出し側に同意の確認を任せると、確認漏れがそのまま同意前の送信になるため、ここで門番になる
export const initGA = () => {
  if (process.env.NODE_ENV !== 'production' || GA_MEASUREMENT_ID === '') {
    return;
  }

  if (getLocalStorage('cookie-consent') !== 'accepted') {
    return;
  }

  // config の自動 page_view を止めないと、sendPageview と合わせて二重に計上される
  ReactGA.initialize(GA_MEASUREMENT_ID, { gtagOptions: { send_page_view: false } });
};

export const applyCookieConsent = (state: 'accepted' | 'rejected') => {
  setLocalStorage('cookie-consent', state);
  document.documentElement.dataset.cookieConsent = state;

  if (state === 'accepted') {
    initGA();
    sendPageview();
  }
};
