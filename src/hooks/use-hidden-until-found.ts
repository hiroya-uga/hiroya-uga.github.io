import { useEffect } from 'react';

export const useHiddenUntilFound = () => {
  useEffect(() => {
    document.querySelectorAll('[data-hidden-until-found]').forEach((node) => {
      node.setAttribute('hidden', 'until-found');
      node.removeAttribute('data-hidden-until-found');
    });
  }, []);

  return {
    'data-hidden-until-found': '',
    hidden: true,
  };
};
