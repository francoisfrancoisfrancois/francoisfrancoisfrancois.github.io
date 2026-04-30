const RATIO_NARROW = 0.625; // height / width when viewport is tall/narrow
const RATIO_WIDE   = 0.530; // height / width when viewport is short/wide

function resizeSections() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportRatio = vh / vw;

  // Helper: compute height based on viewport ratio rules
  function computeHeight() {
    if (viewportRatio > RATIO_NARROW) {
      // viewport is tall/narrow → use narrow ratio
      return vw * RATIO_NARROW;
    } else if (viewportRatio < RATIO_WIDE) {
      // viewport is wide/short → use wide ratio
      return vw * RATIO_WIDE;
    } else {
      // in-between → fill viewport height
      return vh;
    }
  }

  const heightToApply = computeHeight();

  // Apply to all project headers
  document.querySelectorAll('.project-header.section').forEach(header => {
    header.style.height = `${heightToApply}px`;
  });

  // Apply to all image slides
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    // use data-ratio if you want per-slide overrides, else default to same logic
    slide.style.height = `${heightToApply}px`;
  });
}

// Run on load and resize
document.addEventListener('DOMContentLoaded', resizeSections);
window.addEventListener('resize', resizeSections);

/* ---------- Sticky-visible-when-stuck logic ---------- */

/**
 * Return true when the element is currently stuck to the top of the viewport.
 * We treat it as "stuck" when its bounding rect top is <= 0 (at the top).
 * This is robust across browsers.
 */
function isElementStuckToTop(el) {
  const rect = el.getBoundingClientRect();
  // When an element is sticky at the top, its top becomes 0 (or very close)
  return rect.top <= 0;
}

function initStickyObservers() {
  const titles = document.querySelectorAll('.project-sticky-title');

  // callback to evaluate and toggle .is-sticky for a single element
  function evaluate(title) {
    if (!title.isConnected) return;
    const stuck = isElementStuckToTop(title);
    title.classList.toggle('is-sticky', stuck);
  }

  // run initial evaluation for all titles
  titles.forEach(evaluate);

  // Update on scroll (cheap-ish) and resize (debounced)
  // We keep scroll handler lightweight: only toggles classes by checking bounding rect.
  let rafScheduled = false;
  function onScrollOrRAF() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      titles.forEach(evaluate);
      rafScheduled = false;
    });
  }

  // Debounced resize to avoid thrash
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // re-run sizing (so resizeSections may update heights) then evaluate
      resizeSections();
      titles.forEach(evaluate);
    }, 80);
  }

  window.addEventListener('scroll', onScrollOrRAF, { passive: true });
  window.addEventListener('resize', onResize);

  // Also observe title content size changes (if the sticky title wraps, etc.)
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      // re-evaluate when any title changes size
      titles.forEach(evaluate);
    });
    titles.forEach(t => ro.observe(t));
  }
}

/* ---------- Boot up ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // initial sizing
  resizeSections();

  // if fonts change, recompute
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      resizeSections();
    }).catch(() => {});
  }

  // init sticky detection after initial sizing
  initStickyObservers();
});

// keep resizing logic for desktop / significant resizes
window.addEventListener('resize', () => {
  // we still want to resize sections on desktop immediately
  // but the sticky detection will do re-evaluation after resize (see onResize)
  if (window.__resizeTimeout) clearTimeout(window.__resizeTimeout);
  window.__resizeTimeout = setTimeout(resizeSections, 60);
});
