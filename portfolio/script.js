const PDF_RATIO = 800 / 1280; // 0.625

function resizeSections() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  document.querySelectorAll('.project-header.section').forEach(section => {
    const ratio = parseFloat(section.dataset.ratio || PDF_RATIO);
    const ratioHeight = ratio * vw;

    const stickyTitle = section.querySelector('.sticky-header');
    const description = section.querySelector('.header-description');

    const stickyHeight = stickyTitle ? stickyTitle.offsetHeight : 0;
    const descriptionHeight = description ? description.offsetHeight : 0;

    const contentHeight = stickyHeight + descriptionHeight;

    // final height: at least ratioHeight or contentHeight, but never exceed viewport
    const finalHeight = Math.min(vh, Math.max(ratioHeight, contentHeight));

    section.style.height = `${finalHeight}px`;
  });

  // --- Slides: keep the ratio logic
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    const ratio = parseFloat(slide.dataset.ratio || PDF_RATIO);
    const slideHeight = Math.min(vh, ratio * vw);
    slide.style.height = `${slideHeight}px`;
  });
}

// Initial sizing and resize handling
document.addEventListener('DOMContentLoaded', resizeSections);
window.addEventListener('resize', () => {
  clearTimeout(window.__resizeTimeout);
  window.__resizeTimeout = setTimeout(resizeSections, 60);
});
