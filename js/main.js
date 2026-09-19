(() => {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const hasNav = Boolean(nav && toggle);
  if (hasNav) {
    const list = document.getElementById("nav-list");
    const links = list ? Array.from(list.querySelectorAll("a")) : [];

    function isOpen() {
      return nav.classList.contains("is-open");
    }

    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      if (isOpen()) {
        close();
        return;
      }
      open();
    });

    for (const a of links) {
      a.addEventListener("click", () => {
        close();
      });
    }

    document.addEventListener("click", (e) => {
      if (!isOpen()) {
        return;
      }

      const target = e.target;
      if (target instanceof Element && nav.contains(target)) {
        return;
      }

      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    const mql = window.matchMedia("(min-width: 761px)");
    function handleViewport() {
      if (mql.matches && isOpen()) {
        close();
      }
    }

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleViewport);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handleViewport);
    }
  }

  // 1. Hero staged entrance
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function markLoaded() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("is-loaded");
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markLoaded, { once: true });
  } else {
    markLoaded();
  }

  // 6. Header scrolled state
  const header = document.querySelector(".site-header");
  let ticking = false;
  function onScroll() {
    if (!header) {
      return;
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY > 24) {
          header.classList.add("is-scrolled");
        } else {
          header.classList.remove("is-scrolled");
        }
        ticking = false;
      });
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 3 & 4. Scroll reveals (labels + cards)
  if (!prefersReduced && "IntersectionObserver" in window) {
    const labelObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            labelObserver.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    for (const el of document.querySelectorAll(".section-label")) {
      labelObserver.observe(el);
    }

    const revealEls = document.querySelectorAll(
      ".interest, .scenery-card, .about-card, .perth-card, .perth-figure, .contact-card-black, .quote-card"
    );
    for (const el of revealEls) {
      el.classList.add("reveal");
    }
    const cardObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target;
            const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
            const idx = siblings.indexOf(el);
            const delay = (idx % 4) * 70;
            el.style.transitionDelay = delay + "ms";
            el.classList.add("is-visible");
            cardObserver.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    for (const el of revealEls) {
      cardObserver.observe(el);
    }
  } else {
    for (const el of document.querySelectorAll(".section-label")) {
      el.classList.add("is-visible");
    }
  }
})();
