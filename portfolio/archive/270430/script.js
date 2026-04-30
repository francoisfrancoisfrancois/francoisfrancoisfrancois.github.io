/* ============================================================
   PROJECTS DATA — single source of truth
   Edit here; headers + index are generated automatically.
   ============================================================ */

const PROJECTS = [
  {
    project: "Les Buts de l'Astronautique",
    type:    "Book",
    client:  "Self-initiated",
    year:    "2018",
  },
  {
    project: "ME Graph Mono",
    type:    "Typography",
    client:  "HelloMe / Ledger",
    year:    "2020–21",
  },
  {
    project: "wwww.nice.rocks",
    type:    "Website, Identity",
    client:  "Self-initiated",
    year:    "2025",
  },
  {
    project: "Early Hours",
    type:    "Lettering, Visual identity",
    client:  "HelloMe / Apple Music",
    year:    "2022",
  },
  {
    project: "Selected lettering",
    type:    "Lettering, Visual identity",
    client:  "HelloMe / Apple Music",
    year:    "2020–24",
  },
  {
    project: "Autobahn",
    type:    "Exhibition, Communication",
    client:  "HelloMe / Jörg Brüggemann",
    year:    "2021",
  },
  {
    project: "ME Chronik",
    type:    "Typography",
    client:  "HelloMe",
    year:    "2020–25",
  },
  {
    project: "www.sebastianschoenheit.co",
    type:    "Website, Identity",
    client:  "HelloMe / Sebastian Schönheit",
    year:    "2022",
  },
];


/* ============================================================
   POPULATE PROJECT HEADERS
   ============================================================ */

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function populateHeaders() {
  const projectSections = document.querySelectorAll('.project');

  projectSections.forEach((section, i) => {
    const data = PROJECTS[i];
    if (!data) return;

    // Assign a stable id for scroll targeting
    section.id = `project-${slugify(data.project)}`;

    const hProject = section.querySelector('.h-project');
    const hType    = section.querySelector('.h-type');
    const hClient  = section.querySelector('.h-client');
    const hYear    = section.querySelector('.h-year');

    if (hProject) hProject.innerHTML = `Project<br>${data.project}`;
    if (hType)    hType.innerHTML    = `Type<br>${data.type}`;
    if (hClient)  hClient.innerHTML  = `Client<br>${data.client}`;
    if (hYear)    hYear.innerHTML    = `Year<br>${data.year}`;

    const tProject = section.querySelector('.t-project');
    const tType    = section.querySelector('.t-type');
    const tClient  = section.querySelector('.t-client');
    const tYear    = section.querySelector('.t-year');

    if (tProject) tProject.textContent = data.project;
    if (tType)    tType.textContent    = data.type;
    if (tClient)  tClient.textContent  = data.client;
    if (tYear)    tYear.textContent    = data.year;
  });
}


/* ============================================================
   POPULATE INDEX
   ============================================================ */

function populateIndex() {
  const container = document.getElementById('intro-index-entries');
  if (!container) return;

  container.innerHTML = PROJECTS.map((data, i) => `
    <div class="intro-grid intro-index-row" data-target="project-${slugify(data.project)}" role="button" tabindex="0">
      <div class="i-index-project">${data.project}</div>
      <div class="i-index-type">${data.type}</div>
      <div class="i-index-client">${data.client}</div>
      <div class="i-index-year">${data.year}</div>
    </div>
  `).join('');

  // Wire up click + keyboard handlers
  container.querySelectorAll('.intro-index-row').forEach(row => {
    const handler = () => {
      const target = document.getElementById(row.dataset.target);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    row.addEventListener('click', handler);
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}


/* ============================================================
   SIZING
   ============================================================ */

const RATIO_NARROW = 0.625;
const RATIO_WIDE   = 0.530;
const MOBILE_BREAKPOINT = 1100;

function computeSlideHeight() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const viewportRatio = vh / vw;

  if (viewportRatio > RATIO_NARROW) return vw * RATIO_NARROW;
  if (viewportRatio < RATIO_WIDE)   return vw * RATIO_WIDE;
  return vh;
}

function positionIntroIndex() {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const row3 = document.querySelector('.intro-row-3');
  if (!row3) return;

  if (isMobile) {
    // Mobile: natural flow, no offset
    row3.style.paddingTop = '';
    row3.style.marginTop  = '';
    return;
  }

  const slide = document.querySelector('.intro-slide.section');
  if (!slide) return;

  const slideH  = slide.offsetHeight;
  const midpoint = slideH / 2;

  // Measure everything above row-3 inside the slide
  const row1 = slide.querySelector('.intro-row-1');
  const row2 = slide.querySelector('.intro-row-2');

  const aboveH = (row1 ? row1.offsetHeight : 0)
               + (row2 ? row2.offsetHeight : 0)
               + parseFloat(getComputedStyle(row2 || slide).marginTop || 0)
               + parseFloat(getComputedStyle(slide).paddingTop || 0);

  // We want the top of row-3 to sit at midpoint.
  // margin-top: auto already consumed remaining space; add explicit paddingTop.
  const gap = Math.max(0, midpoint - aboveH);
  row3.style.marginTop  = '0';
  row3.style.paddingTop = `${gap}px`;
}

function resizeSections() {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const heightToApply = computeSlideHeight();

  const introSlide = document.querySelector('.intro-slide.section');
  if (introSlide) {
    introSlide.style.height = isMobile ? '' : `${heightToApply}px`;
  }

  document.querySelectorAll('.project-header.section').forEach(header => {
    header.style.height = `${heightToApply}px`;
  });

  document.querySelectorAll('.image-section .slide').forEach(slide => {
    slide.style.height = `${heightToApply}px`;
  });

  // Re-anchor index after heights are set
  positionIntroIndex();
}


/* ============================================================
   STICKY TITLE DETECTION
   ============================================================ */

function isElementStuckToTop(el) {
  return el.getBoundingClientRect().top <= 0;
}

function initStickyObservers() {
  const titles = document.querySelectorAll('.project-sticky-title');

  function evaluate(title) {
    if (!title.isConnected) return;
    title.classList.toggle('is-sticky', isElementStuckToTop(title));
  }

  titles.forEach(evaluate);

  let rafScheduled = false;
  function onScrollOrRAF() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      titles.forEach(evaluate);
      rafScheduled = false;
    });
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeSections();
      titles.forEach(evaluate);
    }, 80);
  }

  window.addEventListener('scroll', onScrollOrRAF, { passive: true });
  window.addEventListener('resize', onResize);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => titles.forEach(evaluate));
    titles.forEach(t => ro.observe(t));
  }
}


/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  populateHeaders();
  populateIndex();
  resizeSections();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => resizeSections()).catch(() => {});
  }

  initStickyObservers();
});

window.addEventListener('resize', () => {
  if (window.__resizeTimeout) clearTimeout(window.__resizeTimeout);
  window.__resizeTimeout = setTimeout(resizeSections, 60);
});
