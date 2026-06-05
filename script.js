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
