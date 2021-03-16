// Разбей задание на несколько подзадач:

// Создание и рендер разметки по массиву данных и предоставленному шаблону. - Add
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения. - Add
// Открытие модального окна по клику на элементе галереи. -Add
// Подмена значения атрибута src элемента img.lightbox__image. -Add
// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].-Add
// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, -Add
//  чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее. -Add

// Разметка элемента галереи
// Ссылка на оригинальное изображение должна храниться в data-атрибуте source на элементе img,
//  и указываться в href ссылки (это необходимо для доступности).

// Дополнительно
// Следующий функционал не обязателен при сдаче задания, но будет хорошей практикой по работе с событиями.

// Закрытие модального окна по клику на div.lightbox__overlay. -Add
// Закрытие модального окна по нажатию клавиши ESC. -Add
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо" -Add

import images from './gallery-items.js';

const bodyRef = document.querySelector('body');
const imadgesListRef = document.querySelector('.js-gallery');
const modalRef = document.querySelector('.js-lightbox');
const modalOverlay = document.querySelector('.lightbox__overlay');
const modalImgRef = document.querySelector('.lightbox__image');
const closeModalBtn = document.querySelector('.lightbox__button');

let currentIndex = 0;

const imadgesMarkup = images.reduce(
  (acc, { preview, original, description }) => {
    return (
      acc +
      `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
    target="_blank" 
    rel="noreferrer noopener"
  >
    <img
      loading="lazy"
      class="gallery__image lazyload"
      data-src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`
    );
  },
  '',
);

imadgesListRef.insertAdjacentHTML('afterbegin', imadgesMarkup);

imadgesListRef.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.localName === 'img') {
    addImgModal();
  }
});

closeModalBtn.addEventListener('click', () => {
  removeImgModal();
});

modalOverlay.addEventListener('click', event => {
  if (event.target.localName === 'img') {
    return;
  }
  removeImgModal();
});

function removeImgModal() {
  bodyRef.classList.remove('is-open');
  modalRef.classList.remove('is-open');
  modalImgRef.removeAttribute('src');
  modalImgRef.removeAttribute('alt');
  window.removeEventListener('keyup', listenerArrowRight);
}

function addImgModal() {
  bodyRef.classList.add('is-open');
  modalRef.classList.add('is-open');
  modalImgRef.src = event.target.dataset.source;
  modalImgRef.alt = event.target.alt;

  images.forEach(el => {
    if (el.original === modalImgRef.src) {
      currentIndex = images.indexOf(el);
    }
  });

  window.addEventListener('keyup', listenerArrow);
}

function listenerArrow(event) {
  if (event.key === 'Escape') {
    removeImgModal();
  }
  if (event.key === 'ArrowRight') {
    currentIndex === images.length - 1 ? (currentIndex = 0) : currentIndex++;
  }
  if (event.key === 'ArrowLeft') {
    currentIndex === 0 ? (currentIndex = images.length - 1) : currentIndex--;
  }
  modalImgRef.src = images[currentIndex].original;
  modalImgRef.alt = images[currentIndex].description;
}

if ('loading' in HTMLImageElement.prototype) {
  // console.log('Браузер поддерживает lazyload');
  addSrcAttrToLazyImages();
} else {
  // console.log('Браузер НЕ поддерживает lazyload');
  addLazySizesScript();
}

const lazyImages = document.querySelectorAll('img[data-src]');

lazyImages.forEach(image => {
  image.addEventListener('load', onImageLoaded, { once: true });
});

function onImageLoaded(evt) {
  // console.log('Картинка загрузилась');
  evt.target.classList.add('appear');
}

function addSrcAttrToLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}
function addLazySizesScript() {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
  script.integrity =
    'sha512-TmDwFLhg3UA4ZG0Eb4MIyT1O1Mb+Oww5kFG0uHqXsdbyZz9DcvYQhKpGgNkamAI6h2lGGZq2X8ftOJvF/XjTUg==';
  script.crossOrigin = 'anonymous';

  document.body.appendChild(script);
}