// Link hover preview — fetches target page and shows content in a scrollable card
(function () {
  var tooltip = null;
  var showTimer = null;
  var hideTimer = null;
  var activeLink = null;
  var cache = {};
  var fileExtRe = /\.(jpe?g|png|gif|webp|svg|pdf|css|js|xml|json|ico|webmanifest)$/i;

  // Cache the canonical origin so we don't query the DOM on every mouseover
  var canonicalOrigin = (function () {
    var el = document.querySelector("link[rel='canonical']");
    if (!el) return null;
    try {
      return new URL(el.getAttribute("href")).origin;
    } catch (e) {
      return null;
    }
  })();

  function isSameOrigin(url) {
    return url.origin === location.origin || url.origin === canonicalOrigin;
  }

  function isPreviewable(a) {
    if (a.closest("header, footer")) return false;
    if (a.getAttribute("target") === "_blank") return false;
    var href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;

    var url;
    try {
      url = new URL(href, location.href);
    } catch (e) {
      return false;
    }

    if (!isSameOrigin(url)) return false;
    if (url.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "")) return false;
    if (fileExtRe.test(url.pathname)) return false;
    return true;
  }

  function toFetchableUrl(a) {
    try {
      var url = new URL(a.getAttribute("href"), location.href);
      return location.origin + url.pathname + url.search;
    } catch (e) {
      return null;
    }
  }

  function extractContent(doc) {
    var titleEl = doc.querySelector("h1") || doc.querySelector("title");
    var title = titleEl ? titleEl.textContent.trim() : "";

    // Article pages have section.prose wrapping TOC + body text.
    // The header's .prose only contains the feature image — skip it.
    // List/tag pages fall back to main content area.
    var container =
      doc.querySelector("section.prose") ||
      doc.querySelector("main#main-content") ||
      doc.querySelector("main");

    var contentHtml = "";
    if (container) {
      var clone = container.cloneNode(true);
      clone
        .querySelectorAll(
          ".toc, .not-prose, [aria-label='Anchor'], script, style, nav, details, .order-first"
        )
        .forEach(function (n) { n.remove(); });
      contentHtml = clone.innerHTML;
    }

    return { title: title, contentHtml: contentHtml };
  }

  function fetchPreview(fetchUrl, cb) {
    if (cache[fetchUrl]) {
      cb(cache[fetchUrl]);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", fetchUrl);
    xhr.onload = function () {
      if (xhr.status !== 200) return;
      var doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
      var result = extractContent(doc);
      cache[fetchUrl] = result;
      cb(result);
    };
    xhr.send();
  }

  function createTooltip(data) {
    var el = document.createElement("div");
    el.className = "preview-tooltip";
    applyTheme(el);

    if (data.title) {
      var titleEl = document.createElement("div");
      titleEl.className = "preview-tooltip-title";
      titleEl.textContent = data.title;
      el.appendChild(titleEl);
    }

    if (data.contentHtml) {
      var bodyEl = document.createElement("div");
      bodyEl.className = "preview-tooltip-body";
      bodyEl.innerHTML = data.contentHtml;
      el.appendChild(bodyEl);
    }

    el.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    el.addEventListener("mouseleave", function () { hide(); });
    return el;
  }

  function applyTheme(el) {
    var isDark = document.documentElement.classList.contains("dark");
    el.style.setProperty("--pt-bg", isDark ? "#262626" : "#fafafa");
    el.style.setProperty("--pt-border", isDark ? "#404040" : "#e5e5e5");
    el.style.setProperty("--pt-text", isDark ? "#e5e5e5" : "#262626");
  }

  function position(tooltipEl, linkEl) {
    var rect = linkEl.getBoundingClientRect();
    var gap = 8;

    tooltipEl.style.visibility = "hidden";
    document.body.appendChild(tooltipEl);

    var tw = tooltipEl.offsetWidth;
    var th = tooltipEl.offsetHeight;

    var top = rect.bottom + gap;
    if (top + th > window.innerHeight && rect.top - gap - th > 0) {
      top = rect.top - gap - th;
    }

    var left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));

    tooltipEl.style.top = top + "px";
    tooltipEl.style.left = left + "px";
    tooltipEl.style.visibility = "visible";

    requestAnimationFrame(function () {
      tooltipEl.classList.add("preview-tooltip-visible");
    });
  }

  function show(link) {
    hide();
    var fetchUrl = toFetchableUrl(link);
    if (!fetchUrl) return;
    activeLink = link;

    fetchPreview(fetchUrl, function (data) {
      if (activeLink !== link) return;
      if (!data.title && !data.contentHtml) return;
      tooltip = createTooltip(data);
      position(tooltip, link);
    });
  }

  function hide() {
    if (tooltip) {
      tooltip.remove();
      tooltip = null;
    }
    activeLink = null;
  }

  document.addEventListener("mouseover", function (e) {
    var link = e.target.closest("a");
    if (!link || !isPreviewable(link)) return;
    if (link === activeLink) return;

    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { show(link); }, 100);

    link.addEventListener(
      "mouseleave",
      function () {
        clearTimeout(showTimer);
        hideTimer = setTimeout(hide, 200);
      },
      { once: true }
    );
  });

  // Update tooltip theme when dark mode is toggled
  new MutationObserver(function () {
    if (tooltip) applyTheme(tooltip);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
