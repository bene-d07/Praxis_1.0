document.querySelectorAll('.accordion button').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));function filterTreatments(cat){document.querySelectorAll('[data-cat]').forEach(el=>el.hidden=cat!='all'&&el.dataset.cat!=cat);document.querySelectorAll('.filter button').forEach(b=>b.classList.toggle('active',b.dataset.filter==cat));}document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('side-open')});document.querySelectorAll('.side-menu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('side-open')));

document.querySelectorAll('.cv-acc').forEach(btn=>btn.addEventListener('click',()=>{const panel=btn.nextElementSibling;btn.classList.toggle('open');if(panel)panel.classList.toggle('show');}));


// Startseiten-Leistungsspektrum: klick- und swipefähiges Carousel
(function(){
  const carousel = document.querySelector('[data-spectrum-carousel]');
  if(!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.spectrum-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
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

  prev && prev.addEventListener('click', () => goTo(index - 1));
  next && next.addEventListener('click', () => goTo(index + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.carouselDot))));

  carousel.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    currentX = startX;
    dragging = true;
  }, {passive:true});

  carousel.addEventListener('touchmove', (event) => {
    if(!dragging) return;
    currentX = event.touches[0].clientX;
  }, {passive:true});

  carousel.addEventListener('touchend', () => {
    if(!dragging) return;
    const delta = currentX - startX;
    if(Math.abs(delta) > 45){
      goTo(delta < 0 ? index + 1 : index - 1);
    }
    dragging = false;
  });

  goTo(0);
})();


// Scroll-Reveal: dezente Einblendung von Abschnitten, Karten und der Person-Timeline
(function(){
  const items = Array.from(document.querySelectorAll('section, .why-grid article, .finder-grid a, .news-grid article, .person-timeline article, .spectrum-feature-card, .specialty-depth'));
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
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  items.forEach(el=>observer.observe(el));
})();


// Aktiver Menüpunkt: wird automatisch anhand der aktuellen Datei gesetzt
(function(){
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
})();

// Ruhigeres Akkordeon-Verhalten: nur ein geöffneter Bereich pro Gruppe, wenn data-single gesetzt ist
(function(){
  document.querySelectorAll('[data-single-accordion]').forEach(group=>{
    group.querySelectorAll('.accordion button, .cv-acc').forEach(btn=>{
      btn.addEventListener('click',()=>{
        group.querySelectorAll('.open').forEach(open=>{ if(open !== btn && open !== btn.parentElement) open.classList.remove('open'); });
        group.querySelectorAll('.show').forEach(show=>{ if(show !== btn.nextElementSibling) show.classList.remove('show'); });
      });
    });
  });
})();


// CV-Akkordeon: immer nur ein Bereich geöffnet
(function(){
  document.querySelectorAll('.cv-accordion-card').forEach(group=>{
    group.querySelectorAll('.cv-acc').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const panel = btn.nextElementSibling;
        const willOpen = !btn.classList.contains('open') || !(panel && panel.classList.contains('show'));
        group.querySelectorAll('.cv-acc').forEach(other=>{
          if(other !== btn) other.classList.remove('open');
        });
        group.querySelectorAll('.cv-panel').forEach(otherPanel=>{
          if(otherPanel !== panel) otherPanel.classList.remove('show');
        });
        if(willOpen){
          btn.classList.add('open');
          if(panel) panel.classList.add('show');
        }
      });
    });
  });
})();
