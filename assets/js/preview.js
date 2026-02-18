// Link hover preview — fetches target page and shows content in a scrollable card
(function () {
  var tooltip = null;
  var showTimer = null;
  var hideTimer = null;
  var activeLink = null;
  var cache = {};

  // File extensions that are definitely not pages
  var fileExtRe = /\.(jpe?g|png|gif|webp|svg|pdf|css|js|xml|json|ico|webmanifest)$/i;

  function resolveHref(a) {
    // Get the full resolved URL for any link (handles both relative and absolute)
    try {
      return new URL(a.getAttribute("href"), location.href);
    } catch (e) {
      return null;
    }
  }

  function isPreviewable(a) {
    // Skip header/footer nav links
    if (a.closest("header, footer")) return false;
    if (a.getAttribute("target") === "_blank") return false;
    var href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;

    var url = resolveHref(a);
    if (!url) return false;

    // Must be same site — compare against both the current origin (dev server)
    // and the canonical site origin (production baseURL)
    var sameAsCurrent = url.origin === location.origin;
    var sameAsCanonical = false;
    var canonical = document.querySelector("link[rel='canonical']");
    if (canonical) {
      try {
        var canonicalOrigin = new URL(canonical.getAttribute("href")).origin;
        sameAsCanonical = url.origin === canonicalOrigin;
      } catch (e) {}
    }
    if (!sameAsCurrent && !sameAsCanonical) return false;

    // Must not be the current page
    var targetPath = url.pathname.replace(/\/$/, "");
    var currentPath = location.pathname.replace(/\/$/, "");
    if (targetPath === currentPath) return false;

    // Skip file links (images, assets, etc.)
    if (fileExtRe.test(url.pathname)) return false;

    return true;
  }

  function toFetchableUrl(a) {
    // Convert the link href to a URL we can actually fetch from the current server
    var url = resolveHref(a);
    if (!url) return null;
    // Always fetch from the current origin (works on both dev and prod)
    return location.origin + url.pathname + url.search;
  }

  function extractContent(doc) {
    var title =
      doc.querySelector("h1") ||
      doc.querySelector("title");
    var titleText = title ? title.textContent.trim() : "";

    // For article pages: the main content is in section.prose, which contains
    // a TOC sidebar and the actual body text in a child div.
    // The header also has a .prose div that only wraps the feature image — skip it.
    var content = null;
    var sectionProse = doc.querySelector("section.prose");
    if (sectionProse) {
      // Clone so we can strip elements without affecting the cached doc
      content = sectionProse.cloneNode(true);
    } else {
      // List/tag pages or other layouts — grab main content area
      var main = doc.querySelector("main#main-content") || doc.querySelector("main");
      if (main) content = main.cloneNode(true);
    }

    if (content) {
      // Remove TOC, anchor links, non-prose elements, header elements
      content
        .querySelectorAll(
          ".toc, .not-prose, [aria-label='Anchor'], script, style, nav, " +
          "details, .order-first"
        )
        .forEach(function (n) {
          n.remove();
        });
    }

    return { title: titleText, content: content };
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

    if (data.content) {
      var bodyEl = document.createElement("div");
      bodyEl.className = "preview-tooltip-body";
      bodyEl.innerHTML = data.content.innerHTML;
      el.appendChild(bodyEl);
    }

    el.addEventListener("mouseenter", function () {
      clearTimeout(hideTimer);
    });
    el.addEventListener("mouseleave", function () {
      hide();
    });

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
      if (!data.title && !data.content) return;

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
    showTimer = setTimeout(function () {
      show(link);
    }, 100);

    link.addEventListener(
      "mouseleave",
      function () {
        clearTimeout(showTimer);
        hideTimer = setTimeout(hide, 200);
      },
      { once: true }
    );
  });

  // Update tooltip theme when appearance changes
  var observer = new MutationObserver(function () {
    if (tooltip) applyTheme(tooltip);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
