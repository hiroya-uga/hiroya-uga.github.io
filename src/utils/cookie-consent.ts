import { GA_MEASUREMENT_ID } from '@/constants/id';
import { setLocalStorage } from '@/utils/local-storage';
import ReactGA from 'react-ga4';

export const initGA = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  ReactGA.initialize(GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: 'pageview', page: pathname + searchParams.toString() });
};

export const applyCookieConsent = (state: 'accepted' | 'rejected') => {
  setLocalStorage('cookie-consent', state);
  document.documentElement.dataset.cookieConsent = state;

  if (state === 'accepted') {
    initGA();
  }
};
