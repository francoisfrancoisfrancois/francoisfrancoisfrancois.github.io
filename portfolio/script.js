const PDF_RATIO = 800 / 1280; // 0.625

function resizeSections() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Helper: compute ratio height limited by viewport
  const ratioHeight = vw * PDF_RATIO;

  document.querySelectorAll('.project-header.section').forEach(header => {
    // Temporarily remove height to get natural content height
    header.style.height = '';
    const contentHeight = header.scrollHeight;

    // Choose the max of ratioHeight and contentHeight, but never exceed viewport
    const finalHeight = Math.min(Math.max(ratioHeight, contentHeight), vh);

    header.style.height = `${finalHeight}px`;
  });

  // Slides keep ratio
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    const ratio = parseFloat(slide.dataset.ratio || PDF_RATIO);
    const slideHeight = Math.min(vh, vw * ratio);
    slide.style.height = `${slideHeight}px`;
  });
}

// Run on load and resize
window.addEventListener('load', resizeSections);
window.addEventListener('resize', resizeSections);
