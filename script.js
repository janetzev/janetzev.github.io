(() => {
  "use strict";

  // Gör befintliga länkar till projektbilder öppningsbara i ett enkelt bildgalleri.
  const imageLinks = [...document.querySelectorAll('a[href]')].filter(link =>
    /\.(?:avif|gif|jpe?g|png|webp|svg)(?:[?#].*)?$/i.test(link.getAttribute('href'))
  );

  if (!imageLinks.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'image-lightbox';
  dialog.setAttribute('aria-label', 'Förstorad projektbild');
  dialog.innerHTML = `
    <button class="image-lightbox__close" type="button" aria-label="Stäng bild">&times;</button>
    <img class="image-lightbox__image" alt="">
    <p class="image-lightbox__caption" aria-live="polite"></p>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .image-lightbox{position:fixed;inset:0;max-width:min(96vw,1200px);max-height:94vh;padding:48px 20px 18px;border:1px solid #ffffff30;border-radius:12px;background:#111;color:#f5f5f5;box-shadow:0 20px 80px #000b}
    .image-lightbox::backdrop{background:#000d;backdrop-filter:blur(5px)}
    .image-lightbox__image{display:block;max-width:100%;max-height:calc(88vh - 90px);margin:auto;object-fit:contain}
    .image-lightbox__caption{text-align:center;color:#c8c8c8;margin:12px 0 0}
    .image-lightbox__close{position:absolute;top:8px;right:12px;width:38px;height:38px;border:0;border-radius:50%;background:#ffffff18;color:white;font-size:28px;line-height:1;cursor:pointer}
    .image-lightbox__close:hover{background:#ffffff30}
  `;
  document.head.append(style);
  document.body.append(dialog);

  const image = dialog.querySelector('.image-lightbox__image');
  const caption = dialog.querySelector('.image-lightbox__caption');
  const closeButton = dialog.querySelector('.image-lightbox__close');
  let previousFocus = null;

  imageLinks.forEach(link => {
    link.addEventListener('click', event => {
      // Behåll länken fungerande som vanligt om dialoger saknas i webbläsaren.
      if (typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      previousFocus = link;
      const thumbnail = link.querySelector('img');
      image.src = link.href;
      image.alt = thumbnail?.alt || 'Förstorad projektbild';
      caption.textContent = thumbnail?.alt || '';
      dialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    previousFocus?.focus();
  });
})();
