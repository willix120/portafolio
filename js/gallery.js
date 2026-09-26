/*
 * Galería lightbox para las capturas de pantalla.
 * - Navegación con botones, teclado (← → Esc) y swipe táctil
 * - Contador de imágenes y precarga de vecinas
 * - Se activa automáticamente sobre #capturasPantalla
 */
(function () {
  'use strict';

  var container = document.getElementById('capturasPantalla');
  if (!container) return;

  var images = Array.prototype.slice.call(container.querySelectorAll('img'));
  if (!images.length) return;

  var index = 0;
  var trigger = null;

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Cerrar">&times;</button>' +
    '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Imagen anterior">&#10094;</button>' +
    '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Imagen siguiente">&#10095;</button>' +
    '<figure class="lightbox__stage">' +
      '<img class="lightbox__img" alt="">' +
      '<figcaption class="lightbox__caption">' +
        '<span class="lightbox__alt"></span>' +
        '<span class="lightbox__counter"></span>' +
      '</figcaption>' +
    '</figure>' +
    '<div class="lightbox__thumbs"></div>';

  document.body.appendChild(lightbox);

  var stageImg = lightbox.querySelector('.lightbox__img');
  var altEl = lightbox.querySelector('.lightbox__alt');
  var counterEl = lightbox.querySelector('.lightbox__counter');
  var thumbsEl = lightbox.querySelector('.lightbox__thumbs');
  var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  var nextBtn = lightbox.querySelector('.lightbox__nav--next');
  var closeBtn = lightbox.querySelector('.lightbox__close');
  var thumbs = [];

  images.forEach(function (img, i) {
    var thumb = document.createElement('button');
    thumb.className = 'lightbox__thumb';
    thumb.type = 'button';
    thumb.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
    var t = new Image();
    t.src = img.currentSrc || img.src;
    thumb.appendChild(t);
    thumb.addEventListener('click', function () {
      trigger = thumb;
      show(i);
    });
    thumbsEl.appendChild(thumb);
    thumbs.push(thumb);
  });

  function preload(i) {
    if (i >= 0 && i < images.length) {
      var pre = new Image();
      pre.src = images[i].currentSrc || images[i].src;
    }
  }

  function show(i) {
    index = (i + images.length) % images.length;
    var src = images[index].currentSrc || images[index].src;

    stageImg.classList.add('is-loading');
    stageImg.onload = function () {
      stageImg.classList.remove('is-loading');
    };
    stageImg.onerror = function () {
      stageImg.classList.remove('is-loading');
    };
    stageImg.src = src;
    if (stageImg.complete) stageImg.classList.remove('is-loading');
    stageImg.alt = images[index].alt || '';
    altEl.textContent = images[index].alt || '';
    counterEl.textContent = (index + 1) + ' / ' + images.length;

    thumbs.forEach(function (t, j) {
      t.classList.toggle('is-active', j === index);
    });
    thumbs[index].scrollIntoView({ block: 'nearest', inline: 'center' });

    preload(index + 1);
    preload(index - 1);
  }

  function open(i) {
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (trigger) trigger.focus();
  }

  images.forEach(function (img, i) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function () {
      trigger = img;
      open(i);
    });
  });

  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    show(index - 1);
  });

  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    show(index + 1);
  });

  closeBtn.addEventListener('click', close);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
  });

  var touchStartX = 0;
  var touchStartY = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) show(index + 1);
      else show(index - 1);
    }
  }, { passive: true });
})();
