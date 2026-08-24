(function () {
  "use strict";

  var splash = document.getElementById('splash');
  var splashVideo = document.getElementById('splash-video');
  var heroVideo = document.getElementById('hero-video');

  function hideSplash() {
    if (!splash) return;
    document.body.classList.remove('has-splash');
    splash.classList.add('is-hidden');
    if (heroVideo) heroVideo.play();
    setTimeout(function () {
      if (splash && splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 700);
  }

  if (splash && splashVideo) {
    splashVideo.playbackRate = 1.5;
    splashVideo.addEventListener('ended', hideSplash);
    splashVideo.addEventListener('error', hideSplash);
    setTimeout(hideSplash, 8000);
  } else if (splash) {
    hideSplash();
  }

  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var navLinks = siteNav.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  var stats = document.querySelectorAll('.stat');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var stat = entry.target;
      var target = parseInt(stat.getAttribute('data-target'), 10);
      var numEl = stat.querySelector('[data-count]');
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        numEl.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numEl.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(step);
      countObserver.unobserve(stat);
    });
  }, { threshold: 0.4 });
  stats.forEach(function (el) { countObserver.observe(el); });
})();
