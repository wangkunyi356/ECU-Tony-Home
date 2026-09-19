(() => {
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (!nav || !toggle) {
    return;
  }

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
})();
