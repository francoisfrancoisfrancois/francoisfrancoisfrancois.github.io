/* ============================================================
   PROJECTS DATA — single source of truth
   Edit here; headers + index are generated automatically.
   ============================================================ */

const PROJECTS = [
  {
    project:     "Les Buts de l'Astronautique",
    type:        "Publication",
    client:      "Self-initiated",
    year:        "2018",
    description: "Design and layout of a 118-page French-Russian edition of The Aims of Astronautics by Konstantin Tsiolkovsky, Russian pioneer of astronautical theory and visionary of space exploration. The book combines the text of The Goals of Astronautics with Tsiolkovsky's later illustrations for his Album of Cosmic Travels, revealing a poetic and avant-garde vision of space travel and life in zero gravity.",
  },
  {
    project:     "ME Graph Mono",
    type:        "Typography",
    client:      "HelloMe&thinsp;/&thinsp;Ledger",
    year:        "2020–21",
    description: "Design of a bespoke monospaced typeface as part of the redesign of Ledger's corporate identity. The clean, rounded outer contours are balanced by more technical, orthogonal inner forms which, combined with the fixed-width design, reflect the brand's technological and digital ethos. The typeface has since been developed into a complete typeface family by HelloMe and will be released in 2026 through its foundry, MeType.",
  },
  {
    project:     "wwww.nice.rocks",
    type:        "Website, Identity",
    client:      "Self-initiated",
    year:        "2025",
    description: "Design and creation of a personal website featuring a digital collection of stones collected during walks, a childhood pastime revisited on a digital scale. Each stone, geolocated and documented in situ without being taken away, finds its place in a mosaic structured by a grid. Dividers allow the images to be grouped according to the location and date of each walk.",
  },
  {
    project:     "Early Hours",
    type:        "Lettering, Visual identity",
    client:      "HelloMe&thinsp;/&thinsp;Apple Music",
    year:        "2022",
    description: "Design and creation of a lettering for the visual identity of Early Hours, Apple Music's ambient playlists. The Early Hours logo, inspired by digital displays and the curve of an hourglass, blends the digital and the organic to create a distinctive visual. The visual identity in which it features, developed by HelloMe, draws its inspiration from the morning sunrise, with an ethereal image treatment that creates a soothing atmosphere.",
  },
  {
    project:     "Selected lettering",
    type:        "Lettering, Visual identity",
    client:      "HelloMe&thinsp;/&thinsp;Apple Music",
    year:        "2020–24",
    description: "Lettering design and development as part of the ongoing collaboration between HelloMe and Apple Music for the visual identities of numerous playlists on the platform, curated by Apple Music as well as by various artists and DJs.",
  },
  {
    project:     "Auf Wasser gebaut",
    type:        "Publication",
    client:      "HelloMe&thinsp;/&thinsp;IFA Visual Arts",
    year:        "2022",
    description: "Design and layout of the catalogue for Auf Wasser gebaut, an exhibition presented at the IFA Gallery in Berlin and Stuttgart. The publication documents the work of artists exploring themes of water, memory, and place.",
  },
  {
    project:     "Autobahn",
    type:        "Exhibition, Communication",
    client:      "HelloMe&thinsp;/&thinsp;Jörg Brüggemann",
    year:        "2021",
    description: "Exhibition design, signage and communication materials (posters, posts and stories) for Autobahn, a solo exhibition by photographer Jörg Brüggemann at La Friche la Belle de Mai in Marseille, France (16 July – 22 August 2021). The exhibition explores the German motorway network, its landscapes, its dreams of freedom and the lives of those who live and work around the motorway.",
  },
  {
    project:     "ME Chronik",
    type:        "Typography",
    client:      "HelloMe",
    year:        "2020–25",
    description: "Design of the ME Chronik typeface, a family reflecting the typographic richness of the late 19th and early 20th centuries, inspired by classics such as Bookman, Doves Type and the Venezia Series. Versatile in nature, it ranges from a high-contrast light weight, evoking the inner workings of luxury watches, to a low-contrast, brutalist bold weight, reminiscent of cuckoo clock mechanisms. The typeface family will be released in 2026 by MeType, HelloMe's new type foundry.",
  },
  {
    project:     "www.sebastianschoenheit.co",
    type:        "Website, Identity",
    client:      "HelloMe&thinsp;/&thinsp;Sebastian Schönheit",
    year:        "2022",
    description: "Design and development of a digital platform for industrial designer Sebastian Schönheit. The website's design reflects the designer's minimalist and refined aesthetic, showcasing carefully crafted images produced in collaboration with the Berlin-based firm Someform Studio, as well as meticulous typographical details, whilst offering a smooth and efficient user experience.",
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

    const set = (selector, html) => {
      const el = section.querySelector(selector);
      if (el) el.innerHTML = html;
    };

    // Métadonnées sans label
    set('.t-type',   data.type);
    set('.t-client', data.client);
    set('.t-year',   data.year);

    // Titre avec flèche accordéon (replié par défaut)
    set('.t-project', `<span class="t-arrow">▼</span> ${data.project}`);

    // Description — repliée par défaut
    set('.t-description', data.description);
    const descEl = section.querySelector('.t-description');
    if (descEl) descEl.classList.add('is-collapsed');

    // Accordéon
    const projectEl     = section.querySelector('.t-project');
    const descriptionEl = section.querySelector('.t-description');

    if (projectEl && descriptionEl) {
      projectEl.addEventListener('click', () => {
        const collapsed = descriptionEl.classList.toggle('is-collapsed');
        const arrow = projectEl.querySelector('.t-arrow');
        if (arrow) arrow.textContent = collapsed ? '▼' : '▲';
        section.querySelector('.project-sticky-title')?.classList.toggle('is-expanded', !collapsed);
      });
    }
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

  // Partager la hauteur de slide comme variable CSS globale
  document.documentElement.style.setProperty('--slide-h', `${h}px`);

  const introSlide = document.querySelector('.intro-slide.section');
  if (introSlide) {
    introSlide.style.height = isMobile ? '' : `${h}px`;
  }

  positionIntroIndex();
}


/* ============================================================
   STICKY TITLE DETECTION
   ============================================================ */

function initStickyObservers() {
  // Titles are always visible — no opacity toggling needed
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
