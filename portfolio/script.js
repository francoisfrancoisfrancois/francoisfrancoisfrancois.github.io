const PDF_RATIO = 800 / 1280; // 0.625

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function computeHeight(ratio) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return Math.min(vh, ratio * vw);
}

function resizeSections() {
  const mobile = isMobile();

  // Resize header sections
  document.querySelectorAll('.project-header.section').forEach(section => {
    const ratio = parseFloat(section.dataset.ratio || PDF_RATIO);
    const height = computeHeight(ratio);
    section.style.height = `${height}px`;
  });

  // Resize each slide
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    const ratio = parseFloat(slide.dataset.ratio || PDF_RATIO);
    const height = computeHeight(ratio);
    slide.style.height = `${height}px`;
  });

  // Set --vh variable for mobile Safari
  if (mobile) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}

// On desktop, recalc on resize
if (!isMobile()) {
  window.addEventListener('resize', resizeSections);
}

// Always run on DOMContentLoaded and orientation change
document.addEventListener('DOMContentLoaded', resizeSections);
window.addEventListener('orientationchange', resizeSections);
