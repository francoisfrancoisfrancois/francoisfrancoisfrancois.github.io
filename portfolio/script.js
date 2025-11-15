const PDF_RATIO = 800 / 1280; // 0.625

function resizeSections() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Compute height based on PDF ratio but never exceed viewport height
  const computeHeight = ratio => Math.min(vh, ratio * vw);

  // Resize header sections
  document.querySelectorAll('.project-header.section').forEach(section => {
    const ratio = parseFloat(section.dataset.ratio || PDF_RATIO);
    section.style.height = `${computeHeight(ratio)}px`;
  });

  // Resize each slide
  document.querySelectorAll('.image-section .slide').forEach(slide => {
    const ratio = parseFloat(slide.dataset.ratio || PDF_RATIO);
    slide.style.height = `${computeHeight(ratio)}px`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resizeSections();
});

window.addEventListener('resize', resizeSections);