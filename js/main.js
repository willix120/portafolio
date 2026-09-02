(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var navbarLinks = document.querySelectorAll('.navbar__link');
  var sections = [];

  navbarLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.charAt(0) === '#') {
      var section = document.querySelector(href);
      if (section) sections.push({ link: link, section: section });
    }
  });

  function onScroll() {
    var pos = window.scrollY + 80;
    var currentId = '';

    sections.forEach(function (item) {
      if (item.section.offsetTop <= pos) {
        currentId = '#' + item.section.id;
      }
    });

    navbarLinks.forEach(function (link) {
      if (link.getAttribute('href') === currentId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();