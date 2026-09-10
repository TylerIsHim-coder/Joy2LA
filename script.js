(function () {
  "use strict";

  var splash = document.getElementById('splash');
  var splashVideo = document.getElementById('splash-video');
  var heroVideo = document.getElementById('hero-video');
  var splashSeenKey = 'joy2la-splash-seen';

  function hideSplash() {
    if (!splash) return;
    try {
      sessionStorage.setItem(splashSeenKey, '1');
    } catch (e) {}
    document.body.classList.remove('has-splash');
    splash.classList.add('is-hidden');
    if (heroVideo) heroVideo.play();
    setTimeout(function () {
      if (splash && splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 700);
  }

  var splashAlreadySeen = false;
  try {
    splashAlreadySeen = sessionStorage.getItem(splashSeenKey) === '1';
  } catch (e) {}

  if (splash && splashAlreadySeen) {
    document.body.classList.remove('has-splash');
    if (splash.parentNode) splash.parentNode.removeChild(splash);
    if (heroVideo) heroVideo.play();
  } else if (splash && splashVideo) {
    splashVideo.playbackRate = 1.5;
    splashVideo.preservesPitch = true;
    if ('webkitPreservesPitch' in splashVideo) splashVideo.webkitPreservesPitch = true;

    function unlockSplashAudio() {
      splashVideo.muted = false;
      var playAttempt = splashVideo.play();
      if (playAttempt && typeof playAttempt.then === 'function') {
        playAttempt.catch(function () {});
      }
      document.removeEventListener('pointerdown', unlockSplashAudio);
      document.removeEventListener('keydown', unlockSplashAudio);
    }

    splashVideo.muted = false;
    var playPromise = splashVideo.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(function () {
        // Browsers block autoplay with sound — play muted, unmute on first interaction
        splashVideo.muted = true;
        splashVideo.play().catch(function () {});
        document.addEventListener('pointerdown', unlockSplashAudio);
        document.addEventListener('keydown', unlockSplashAudio);
      });
    }

    splashVideo.addEventListener('ended', hideSplash);
    splashVideo.addEventListener('error', hideSplash);
    setTimeout(hideSplash, 8000);
  } else if (splash) {
    hideSplash();
  }

  var header = document.getElementById('site-header');
  var navPill = document.getElementById('nav-pill');
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');
  var compactWidth = 0;
  var animTimer = null;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileNavQuery = window.matchMedia('(max-width: 900px)');

  function isMobileNav() {
    return mobileNavQuery.matches;
  }

  function getOpenWidth() {
    var styles = window.getComputedStyle(header);
    var padL = parseFloat(styles.paddingLeft) || 0;
    var padR = parseFloat(styles.paddingRight) || 0;
    return Math.min(1100, header.clientWidth - padL - padR);
  }

  function setLinkTabIndex(isOpen) {
    var links = siteNav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      if (isOpen) {
        links[i].removeAttribute('tabindex');
      } else {
        links[i].setAttribute('tabindex', '-1');
      }
    }
  }

  function syncBodyNavLock(isOpen) {
    document.body.classList.toggle('nav-open', !!(isOpen && isMobileNav()));
  }

  function finishAnim() {
    if (animTimer) {
      clearTimeout(animTimer);
      animTimer = null;
    }
    navPill.classList.remove('is-animating');
    if (!navPill.classList.contains('open') || isMobileNav()) {
      navPill.style.width = '';
    }
  }

  function setNavOpen(isOpen) {
    if (!navPill || !navToggle || !siteNav) return;
    if (isOpen === navPill.classList.contains('open')) return;

    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    siteNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    setLinkTabIndex(isOpen);
    syncBodyNavLock(isOpen);

    if (isMobileNav() || prefersReducedMotion.matches) {
      navPill.classList.toggle('open', isOpen);
      navPill.style.width = '';
      finishAnim();
      return;
    }

    navPill.classList.add('is-animating');
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(finishAnim, 650);

    if (isOpen) {
      compactWidth = navPill.getBoundingClientRect().width;
      navPill.style.width = compactWidth + 'px';
      navPill.classList.add('open');
      void navPill.offsetWidth;
      navPill.style.width = getOpenWidth() + 'px';
    } else {
      var current = navPill.getBoundingClientRect().width;
      navPill.style.width = current + 'px';
      void navPill.offsetWidth;
      navPill.classList.remove('open');
      navPill.style.width = (compactWidth > 0 ? compactWidth : current) + 'px';
    }
  }

  if (navToggle && navPill && siteNav) {
    var prevTransition = navPill.style.transition;
    navPill.style.transition = 'none';

    if (isMobileNav()) {
      // Compact bar + dropdown on small screens
      navPill.classList.remove('open');
      navPill.style.width = '';
      setLinkTabIndex(false);
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      siteNav.setAttribute('aria-hidden', 'true');
      syncBodyNavLock(false);
    } else {
      // Desktop: start expanded, measure compact width for later collapse
      setLinkTabIndex(true);
      navPill.classList.remove('open');
      navPill.style.width = 'max-content';
      void navPill.offsetWidth;
      compactWidth = navPill.getBoundingClientRect().width;
      navPill.classList.add('open');
      if (!prefersReducedMotion.matches) {
        navPill.style.width = getOpenWidth() + 'px';
      } else {
        navPill.style.width = '';
      }
    }

    void navPill.offsetWidth;
    navPill.style.transition = prevTransition;

    navPill.addEventListener('transitionend', function (e) {
      if (e.target !== navPill || e.propertyName !== 'width') return;
      finishAnim();
    });

    navToggle.addEventListener('click', function () {
      setNavOpen(!navPill.classList.contains('open'));
    });

    siteNav.addEventListener('click', function (e) {
      if (!isMobileNav()) return;
      if (e.target.closest('a')) setNavOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navPill.classList.contains('open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (isMobileNav()) {
        navPill.style.width = '';
        syncBodyNavLock(navPill.classList.contains('open'));
        return;
      }
      document.body.classList.remove('nav-open');
      if (!navPill.classList.contains('open')) return;
      navPill.style.width = getOpenWidth() + 'px';
    });
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
})();
