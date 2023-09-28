'use client';

export const ButtonInH2 = () => {
  return (
    <button
      id="accordion-button"
      aria-expanded="false"
      onClick={() => {
        if (document.getElementById('accordion-div')!.style.display == 'block') {
          document.getElementById('accordion-div')!.style.display = 'none';
          document.getElementById('accordion-button')!.setAttribute('aria-expanded', 'false');
        } else {
          document.getElementById('accordion-div')!.style.display = 'block';
          document.getElementById('accordion-button')!.setAttribute('aria-expanded', 'true');
        }
      }}
    >
      表示非表示切り替え
    </button>
  );
};
