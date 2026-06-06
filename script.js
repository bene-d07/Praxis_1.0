
// Basis-Akkordeons für FAQ: mehrere Bereiche dürfen geöffnet sein
function initFaqAccordions(){
  document.querySelectorAll('.accordion button').forEach((button)=>{
    if(button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click',()=>{
      button.parentElement.classList.toggle('open');
    });
  });
}

// Behandlungsfilter
function filterTreatments(cat){
  document.querySelectorAll('[data-cat]').forEach((el)=>{
    el.hidden = cat !== 'all' && el.dataset.cat !== cat;
  });
  document.querySelectorAll('.filter button').forEach((button)=>{
    button.classList.toggle('active', button.dataset.filter === cat);
  });
}
window.filterTreatments = filterTreatments;

// Seitenmenü
function closeSideMenu(){ document.body.classList.remove('side-open'); }
document.addEventListener('keydown',(event)=>{ if(event.key === 'Escape') closeSideMenu(); });
document.querySelectorAll('.side-menu a').forEach((link)=>link.addEventListener('click', closeSideMenu));

// CV-Akkordeon auf der Prof.-Seite:
// - beim Öffnen schließt sich der vorherige Block
// - beim erneuten Klick kann auch der aktive Block komplett geschlossen werden
function initCvAccordions(){
  document.querySelectorAll('.cv-accordion-card').forEach((group)=>{
    group.querySelectorAll('.cv-acc').forEach((button)=>{
      if(button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.setAttribute('aria-expanded', button.classList.contains('open') ? 'true' : 'false');
      const panel = button.nextElementSibling;
      if(panel && !panel.id){
        panel.id = 'cv-panel-' + Math.random().toString(36).slice(2,9);
        button.setAttribute('aria-controls', panel.id);
      }
      button.addEventListener('click',()=>{
        const ownPanel = button.nextElementSibling;
        const isOpen = button.classList.contains('open');
        group.querySelectorAll('.cv-acc').forEach((other)=>{
          other.classList.remove('open');
          other.setAttribute('aria-expanded','false');
        });
        group.querySelectorAll('.cv-panel').forEach((otherPanel)=>{
          otherPanel.classList.remove('show');
        });
        if(!isOpen){
          button.classList.add('open');
          button.setAttribute('aria-expanded','true');
          if(ownPanel) ownPanel.classList.add('show');
        }
      });
    });
  });
}

// Startseiten-Leistungsspektrum: klick- und swipefähiges Carousel
function initSpectrumCarousel(){
  const carousel = document.querySelector('[data-spectrum-carousel]');
  if(!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.spectrum-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  if(!track || !slides.length) return;
  let index = 0;
  let startX = 0;
  let currentX = 0;
  let dragging = false;
  function goTo(newIndex){
    index = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }
  if(prev) prev.addEventListener('click', () => goTo(index - 1));
  if(next) next.addEventListener('click', () => goTo(index + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.carouselDot))));
  carousel.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX; currentX = startX; dragging = true;
  }, {passive:true});
  carousel.addEventListener('touchmove', (event) => {
    if(!dragging) return; currentX = event.touches[0].clientX;
  }, {passive:true});
  carousel.addEventListener('touchend', () => {
    if(!dragging) return;
    const delta = currentX - startX;
    if(Math.abs(delta) > 45) goTo(delta < 0 ? index + 1 : index - 1);
    dragging = false;
  });
  goTo(0);
}

// Scroll-Reveal: robust, mit Fallback auf sichtbar
function initReveal(){
  const items = Array.from(document.querySelectorAll('section, .why-grid article, .news-grid article, .person-timeline article, .spectrum-feature-card, .specialty-depth'));
  items.forEach(el => el.classList.add('reveal'));
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('reveal-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08, rootMargin:'0px 0px -20px 0px'});
  items.forEach(el=>observer.observe(el));
  // Wichtig für mobile Browser, falls IntersectionObserver verzögert startet:
  setTimeout(()=>items.forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight * 1.25) el.classList.add('reveal-visible');
  }), 250);
}

// Aktiver Menüpunkt
function initActiveLinks(){
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) return;
    const target = href.split('#')[0];
    if(target === current){
      a.classList.add('active-link');
      if(a.closest('.side-menu')) a.setAttribute('aria-current','page');
    }
  });
}

// Mobile-Behandlungen: Bild und Text immer sichtbar, ohne Hover-Abhängigkeit
function ensureMobileTreatmentsVisible(){
  const cards = document.querySelectorAll('.treatment-hover[data-cat]');
  if(!cards.length) return;
  if(window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches){
    const activeFilter = document.querySelector('.filter button.active');
    const current = activeFilter ? activeFilter.dataset.filter : 'all';
    if(!current || current === 'all') cards.forEach(card => card.hidden = false);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  initFaqAccordions();
  initCvAccordions();
  initSpectrumCarousel();
  initReveal();
  initActiveLinks();
  ensureMobileTreatmentsVisible();
});
window.addEventListener('resize', ensureMobileTreatmentsVisible);
ensureMobileTreatmentsVisible();

// Prof.-Dolderer-Timeline: exakt mit dem Scrollfortschritt synchronisiert
function initScrollSyncedTimeline(){
  const timeline = document.querySelector('.person-timeline.scroll-synced');
  if(!timeline) return;
  const track = timeline.querySelector('.vertical-cv.yearline');
  const items = Array.from(timeline.querySelectorAll('.vertical-cv.yearline article'));
  const section = timeline.closest('.person-overview') || timeline;
  if(!track || !items.length) return;

  let ticking = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => window.matchMedia('(max-width: 980px)').matches;

  function clamp(value,min,max){ return Math.max(min, Math.min(max, value)); }

  function update(){
    ticking = false;

    if(reduceMotion || mobile()){
      track.style.setProperty('--timeline-progress','100%');
      items.forEach(item=>{
        item.classList.add('is-passed');
        item.classList.remove('is-current');
        item.style.opacity = '';
        item.style.transform = '';
      });
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const start = viewport * 0.72;
    const end = -rect.height + viewport * 0.34;
    const progress = clamp((start - rect.top) / (start - end), 0, 1);

    track.style.setProperty('--timeline-progress', (progress * 100).toFixed(2) + '%');

    const currentIndex = clamp(Math.floor(progress * items.length), 0, items.length - 1);
    items.forEach((item, index)=>{
      const local = clamp((progress * items.length) - index, 0, 1);
      item.classList.toggle('is-passed', local >= .98);
      item.classList.toggle('is-current', index === currentIndex && progress > .02 && progress < .995);
      item.style.opacity = (0.34 + local * 0.66).toFixed(3);
      item.style.transform = `translateY(${(18 - local * 18).toFixed(2)}px)`;
    });
  }

  function requestUpdate(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate);
  update();
}

// Nachträglich starten, auch wenn ältere Initialisierung bereits abgeschlossen ist
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initScrollSyncedTimeline);
}else{
  initScrollSyncedTimeline();
}
