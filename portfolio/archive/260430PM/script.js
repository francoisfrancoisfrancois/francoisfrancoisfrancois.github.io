/* ============================================================
   PROJECTS DATA — single source of truth
   Edit here; headers + index are generated automatically.
   ============================================================ */

const PROJECTS = [
  {
    project: "Les Buts de l'Astronautique",
    type:    "Publication",
    client:  "Self-initiated",
    year:    "2018",
  },
  {
    project: "ME Graph Mono",
    type:    "Typography",
    client:  "HelloMe&thinsp;/&thinsp;Ledger",
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
    client:  "HelloMe&thinsp;/&thinsp;Apple Music",
    year:    "2022",
  },
  {
    project: "Selected lettering",
    type:    "Lettering, Visual identity",
    client:  "HelloMe&thinsp;/&thinsp;Apple Music",
    year:    "2020–24",
  },
  {
    project: "Auf Wasser gebaut",
    type:    "Publication",
    client:  "HelloMe&thinsp;/&thinsp;IFA Visual Arts",
    year:    "2022",
  },
  {
    project: "Autobahn",
    type:    "Exhibition, Communication",
    client:  "HelloMe&thinsp;/&thinsp;Jörg Brüggemann",
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
    client:  "HelloMe&thinsp;/&thinsp;Sebastian Schönheit",
    year:    "2022",
  },
];


/* ============================================================
   HELPERS
   ============================================================ */

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


/* ============================================================
   POPULATE PROJECT HEADERS
   ============================================================ */

function populateHeaders() {
  document.querySelectorAll('.project').forEach((section, i) => {
    const data = PROJECTS[i];
    if (!data) return;

    section.id = `project-${slugify(data.project)}`;

    const set = (selector, html, asText = false) => {
      const el = section.querySelector(selector);
      if (!el) return;
      if (asText) el.textContent = html;
      else el.innerHTML = html;
    };

    set('.h-project', `Project<br>${data.project}`);
    set('.h-type',    `Type<br>${data.type}`);
    set('.h-client',  `Client<br>${data.client}`);
    set('.h-year',    `Year<br>${data.year}`);

    set('.t-project', data.project);
    set('.t-type',    data.type);
    set('.t-client',  data.client);
    set('.t-year',    data.year);
  });
}


/* ============================================================
   POPULATE INDEX
   ============================================================ */

function populateIndex() {
  const container = document.getElementById('intro-index-entries');
  if (!container) return;

  container.innerHTML = PROJECTS.map(data => `
    <div class="intro-grid intro-index-row" data-target="project-${slugify(data.project)}" role="button" tabindex="0">
      <div class="i-index-project">${data.project}</div>
      <div class="i-index-type">${data.type}</div>
      <div class="i-index-client">${data.client}</div>
      <div class="i-index-year">${data.year}</div>
    </div>
  `).join('');

  container.querySelectorAll('.intro-index-row').forEach(row => {
    const scrollToTarget = () => {
      const target = document.getElementById(row.dataset.target);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    row.addEventListener('click', scrollToTarget);
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTarget(); }
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
    row3.style.paddingTop = '';
    row3.style.marginTop  = '';
    return;
  }

  const slide = document.querySelector('.intro-slide.section');
  if (!slide) return;

  const row1 = slide.querySelector('.intro-row-1');
  const row2 = slide.querySelector('.intro-row-2');

  const aboveH = (row1 ? row1.offsetHeight : 0)
               + (row2 ? row2.offsetHeight : 0)
               + parseFloat(getComputedStyle(row2 || slide).marginTop || 0)
               + parseFloat(getComputedStyle(slide).paddingTop || 0);

  const gap = Math.max(0, slide.offsetHeight / 2 - aboveH);
  row3.style.marginTop  = '0';
  row3.style.paddingTop = `${gap}px`;
}

function resizeSections() {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const h = computeSlideHeight();

  const introSlide = document.querySelector('.intro-slide.section');
  if (introSlide) {
    introSlide.style.height = isMobile ? '' : `${h}px`;
  }



  document.querySelectorAll('.image-section .slide').forEach(el => {
    el.style.height = `${h}px`;
  });

  positionIntroIndex();
}


/* ============================================================
   STICKY TITLE DETECTION
   ============================================================ */

function initStickyObservers() {
  const titles = document.querySelectorAll('.project-sticky-title');

  const evaluate = title => {
    if (title.isConnected) {
      title.classList.toggle('is-sticky', title.getBoundingClientRect().top <= 0);
    }
  };

  titles.forEach(evaluate);

  let rafScheduled = false;
  window.addEventListener('scroll', () => {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      titles.forEach(evaluate);
      rafScheduled = false;
    });
  }, { passive: true });

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
  document.fonts?.ready.then(() => resizeSections()).catch(() => {});
  initStickyObservers();
});

window.addEventListener('resize', (() => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(resizeSections, 80);
  };
})());
