const PDF_RATIO = 800 / 1280; // 0.625

// compute ratio height for a section (based on its data-ratio or default PDF_RATIO)
function ratioHeightFor(section, vw) {
  const ratio = parseFloat(section.dataset.ratio || PDF_RATIO);
  return ratio * vw;
}

// Recalculate sizes for headers and slides
function resizeSections() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // --- HEADER sections: ensure header is at least content height ---
  document.querySelectorAll('.project-header.section').forEach(section => {
    const rH = ratioHeightFor(section, vw);           // desired ratio height
    // Measure natural content height by letting element size itself:
    // Temporarily clear any enforced height so scrollHeight gives the "intrinsic" height.
    const inlineHeight = section.style.height;
    section.style.height = '';                        // remove previous forced height
    const natural = section.scrollHeight;             // natural height of content
    const final = Math.max(rH, natural);              // choose the bigger one
    section.style.height = `${final}px`;              // set enforced height to final
    // (optional) restore inlineHeight if you need — here we overwrite
  });

  // --- Slides: keep the ratio logic (each slide keeps PDF-ratio height but won't force header smaller) ---
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    const ratio = parseFloat(slide.dataset.ratio || PDF_RATIO);
    const slideHeight = Math.min(vh, ratio * vw);
    slide.style.height = `${slideHeight}px`;
  });
}

// Run once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // initial sizing
  resizeSections();

  // Recompute when webfonts finish loading — fonts change metrics and can alter natural height.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(resizeSections).catch(() => {});
  }

  // Observe layout changes inside each header: if content resizes (images, async text), recompute.
  const headerEls = document.querySelectorAll('.project-header.section');
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      // debounce slightly to avoid thrash
      clearTimeout(window.__headerResizeTimeout);
      window.__headerResizeTimeout = setTimeout(resizeSections, 40);
    });
    headerEls.forEach(el => ro.observe(el));
  } else {
    // fallback: also listen to load events on images inside headers
    headerEls.forEach(el => {
      el.querySelectorAll('img').forEach(img => img.addEventListener('load', resizeSections));
    });
  }
});

// keep responsive on window resize
window.addEventListener('resize', () => {
  // debounce
  clearTimeout(window.__resizeTimeout);
  window.__resizeTimeout = setTimeout(resizeSections, 60);
});