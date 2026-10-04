(function () {
  "use strict";

  var cfg = window.ValueSheetConfig || {};
  var GUMROAD_URL = cfg.gumroadUrl || "https://valuesheet.gumroad.com/l/freelancer-tracker-excel";

  // Point every Buy / Gumroad link to the configured Gumroad URL.
  document.querySelectorAll(".js-buy").forEach(function (a) {
    a.setAttribute("href", GUMROAD_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });

  // Price area (configurable, falls back gracefully).
  var priceArea = document.getElementById("priceArea");
  if (priceArea) {
    if (cfg.price && String(cfg.price).trim() !== "") {
      priceArea.innerHTML =
        '<span>' + escapeHtml(cfg.price) + '</span>' +
        (cfg.priceLabel ? '<span class="pricebox__price-label">' + escapeHtml(cfg.priceLabel) + '</span>' : "");
    } else {
      priceArea.innerHTML = '<span class="pricebox__price-note">See current price on Gumroad</span>';
    }
  }

  // Nav scroll state.
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile drawer.
  var menuBtn = document.getElementById("navMenu");
  var drawer = document.getElementById("navDrawer");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", function () {
      var open = drawer.hasAttribute("hidden") ? false : true;
      if (open) {
        drawer.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      } else {
        drawer.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      }
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Product preview tabs.
  var tabs = document.querySelectorAll(".preview__tabs .tab");
  var panes = document.querySelectorAll(".preview__stage .pane");
  var urlLabel = document.getElementById("previewUrl");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      panes.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-pane") === key);
      });
      if (urlLabel && key) {
        urlLabel.textContent = "freelancer-tracker.xlsx · " + capitalize(key);
      }
    });
  });

  // Scroll reveal via IntersectionObserver.
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // FAQ: close others when opening (classic accordion feel).
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
})();
