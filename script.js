/**
 * script.js — hlavní JavaScript pro index.html (Stínění Ráček).
 * Obsahuje veškerou interaktivitu homepage: chování hlavičky při scrollu,
 * mobilní menu, animace při scrollu, animovaná čísla ve statistikách,
 * lightbox galerii, karusel referencí a poptávkový formulář.
 *
 * Očekává, že v <head>/na konci <body> je před tímto souborem načtený
 * products-data.js (definuje globální proměnnou PRODUCTS).
 */
(function initHomepage(){

  /* ---------------------------------------------------------------------
   * Hlavička: chování při scrollování
   * ------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  /**
   * Podbarví hlavičku při scrollu a zobrazí/skryje tlačítko "Nahoru".
   * Nahoře je hlavička průhledná s bílým textem; po 60 px scrollu se hned
   * podbarví na krémovou a text zezrjí do tmava (viz style.css).
   */
  function updateHeaderOnScroll(){
    if(window.scrollY > 60){ header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    if(window.scrollY > 500){ backToTop.classList.add('show'); } else { backToTop.classList.remove('show'); }
  }

  /** Po kliknutí na tlačítko "Nahoru" hladce odscroluje na začátek stránky. */
  function scrollToPageTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('scroll', updateHeaderOnScroll);
  updateHeaderOnScroll();
  backToTop.addEventListener('click', scrollToPageTop);

  /* ---------------------------------------------------------------------
   * Mobilní navigace (hamburger menu)
   * ------------------------------------------------------------------- */
  const burger = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');

  /** Zavře mobilní menu a ztmavené pozadí za ním. */
  function closeMobileNav(){
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
  }

  /** Přepne (otevře/zavře) mobilní menu po kliknutí na hamburger ikonu. */
  function toggleMobileNav(){
    mobileNav.classList.toggle('open');
    overlay.classList.toggle('open');
  }

  burger.addEventListener('click', toggleMobileNav);
  overlay.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));

  /* ---------------------------------------------------------------------
   * Animace prvků při scrollu (fade-in + posun nahoru)
   * ------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  /**
   * Callback IntersectionObserveru pro sekce s třídou .reveal — jakmile
   * prvek vjede do viewportu, přidá mu třídu "in" (spustí CSS animaci)
   * a přestane ho dál sledovat.
   * @param {IntersectionObserverEntry[]} entries
   */
  function revealElementsOnScroll(entries){
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }

  const revealObserver = new IntersectionObserver(revealElementsOnScroll, {threshold:.15});
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
   * Animovaná čísla ve statistikách (počítadla v hero sekci)
   * ------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  /**
   * Postupně navyšuje textový obsah prvku od 0 k cílové hodnotě.
   * @param {HTMLElement} el - element, jehož textContent se má animovat
   * @param {number} target - cílová hodnota, na kterou se má počítadlo dopočítat
   * @param {number} startTime - čas (performance.now()) spuštění animace
   * @param {number} duration - délka animace v milisekundách
   */
  function animateCounterStep(el, target, startTime, duration){
    const now = performance.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(progress * target);
    el.textContent = current;
    if(progress < 1){
      requestAnimationFrame(()=> animateCounterStep(el, target, startTime, duration));
    } else {
      el.textContent = target;
    }
  }

  /**
   * Callback IntersectionObserveru pro čísla se statistikami — jakmile je
   * počítadlo vidět, spustí se jeho animace od 0 do cílové hodnoty.
   * @param {IntersectionObserverEntry[]} entries
   */
  function startCounterAnimationOnScroll(entries){
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1400;
      const startTime = performance.now();
      animateCounterStep(el, target, startTime, duration);
      counterObserver.unobserve(el);
    });
  }

  const counterObserver = new IntersectionObserver(startCounterAnimationOnScroll, {threshold:.5});
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------------
   * Lightbox galerie realizací
   * ------------------------------------------------------------------- */
  const galleryFigures = Array.from(document.querySelectorAll('#galleryGrid figure'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  let currentLightboxIndex = 0;

  /** Vyplní obrázek a popisek v lightboxu podle aktuálně zvoleného indexu. */
  function updateLightboxContent(){
    const fig = galleryFigures[currentLightboxIndex];
    const img = fig.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = fig.getAttribute('data-caption') || '';
  }

  /**
   * Otevře lightbox na fotce s daným indexem.
   * @param {number} index - pořadí fotky v poli galleryFigures
   */
  function openLightbox(index){
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
  }

  /** Zavře lightbox. */
  function closeLightbox(){
    lightbox.classList.remove('open');
  }

  /** Přepne lightbox na předchozí fotku v galerii (cyklicky). */
  function showPreviousLightboxImage(){
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryFigures.length) % galleryFigures.length;
    updateLightboxContent();
  }

  /** Přepne lightbox na další fotku v galerii (cyklicky). */
  function showNextLightboxImage(){
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryFigures.length;
    updateLightboxContent();
  }

  /**
   * Zavře lightbox při kliknutí mimo fotku (na tmavé pozadí).
   * @param {MouseEvent} event
   */
  function handleLightboxBackdropClick(event){
    if(event.target === lightbox){ closeLightbox(); }
  }

  /**
   * Ovládání lightboxu klávesnicí — Escape zavře, šipky листují fotky.
   * @param {KeyboardEvent} event
   */
  function handleLightboxKeydown(event){
    if(!lightbox.classList.contains('open')) return;
    if(event.key === 'Escape') closeLightbox();
    if(event.key === 'ArrowLeft') showPreviousLightboxImage();
    if(event.key === 'ArrowRight') showNextLightboxImage();
  }

  galleryFigures.forEach((fig, index)=>{
    fig.addEventListener('click', ()=> openLightbox(index));
  });
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', showPreviousLightboxImage);
  document.getElementById('lbNext').addEventListener('click', showNextLightboxImage);
  lightbox.addEventListener('click', handleLightboxBackdropClick);
  document.addEventListener('keydown', handleLightboxKeydown);

  /* ---------------------------------------------------------------------
   * Karusel referencí (testimonials)
   * ------------------------------------------------------------------- */
  const track = document.getElementById('tTrack');
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('tDots');
  let currentSlideIndex = 0;
  let autoSlideTimer = null;

  /**
   * Přepne karusel referencí na daný slide a zvýrazní odpovídající tečku.
   * @param {number} index - pořadí slidu, na který se má přepnout
   */
  function goToTestimonialSlide(index){
    currentSlideIndex = index;
    track.style.transform = 'translateX(' + (-100 * index) + '%)';
    Array.from(dotsWrap.children).forEach((dot, dotIndex)=> dot.classList.toggle('active', dotIndex === index));
  }

  /** Posune karusel referencí na další slide (cyklicky) — volá se v intervalu. */
  function advanceTestimonialSlide(){
    goToTestimonialSlide((currentSlideIndex + 1) % slides.length);
  }

  /** Spustí (znovu) automatické posouvání karuselu referencí každých 5,5 s. */
  function startAutoSlide(){
    autoSlideTimer = setInterval(advanceTestimonialSlide, 5500);
  }

  /** Po kliknutí na tečku restartuje časovač automatického posouvání. */
  function restartAutoSlideOnDotClick(){
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  slides.forEach((_, index)=>{
    const dot = document.createElement('button');
    if(index === 0) dot.classList.add('active');
    dot.addEventListener('click', ()=> goToTestimonialSlide(index));
    dotsWrap.appendChild(dot);
  });
  startAutoSlide();
  dotsWrap.addEventListener('click', restartAutoSlideOnDotClick);

  /* ---------------------------------------------------------------------
   * Poptávkový formulář — dynamický výpis produktů dle zvolené kategorie
   * ------------------------------------------------------------------- */
  const serviceSelect = document.getElementById('service');
  const productOptions = document.getElementById('productOptions');

  /**
   * Zaškrtne nebo odškrtne vizuální "chip" produktu podle stavu jeho checkboxu.
   * @param {HTMLInputElement} checkbox - checkbox konkrétního produktu
   * @param {HTMLLabelElement} chipLabel - obalový <label class="product-chip">
   */
  function toggleProductChipStyle(checkbox, chipLabel){
    chipLabel.classList.toggle('checked', checkbox.checked);
  }

  /**
   * Znovu vykreslí seznam produktů podle aktuálně zvolené kategorie
   * v poptávkovém formuláři. Volá se při změně kategorie, po odeslání
   * formuláře (reset) i při prvním načtení stránky.
   * @param {string} [preselectId] - id produktu, který se má rovnou předzaškrtnout
   *   (používá se, když uživatel přijde z detailu produktu)
   */
  function renderProductOptions(preselectId){
    const category = serviceSelect.value;
    productOptions.innerHTML = '';
    const items = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.filter(p => p.category === category) : [];
    if(items.length === 0){
      productOptions.classList.add('empty');
      return;
    }
    productOptions.classList.remove('empty');
    items.forEach(product=>{
      const chipLabel = document.createElement('label');
      chipLabel.className = 'product-chip';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'product';
      checkbox.value = product.id;
      if(preselectId && product.id === preselectId){
        checkbox.checked = true;
        chipLabel.classList.add('checked');
      }
      const label = document.createElement('span');
      label.textContent = product.name;
      checkbox.addEventListener('change', ()=> toggleProductChipStyle(checkbox, chipLabel));
      chipLabel.appendChild(checkbox);
      chipLabel.appendChild(label);
      productOptions.appendChild(chipLabel);
    });
  }

  /** Po změně kategorie v poptávce překreslí seznam konkrétních produktů. */
  function handleServiceCategoryChange(){
    renderProductOptions();
  }

  serviceSelect.addEventListener('change', handleServiceCategoryChange);

  /**
   * Zjistí, jestli uživatel přišel z detailu produktu (index.html?product=<id>#contact),
   * a pokud ano, vrátí id tohoto produktu a rovnou nastaví odpovídající
   * kategorii ve výběru "Mám zájem o".
   * @returns {string|null} id produktu k předvýběru, nebo null
   */
  function getPreselectedProductIdFromUrl(){
    const urlParams = new URLSearchParams(window.location.search);
    const preselectProductId = urlParams.get('product');
    if(!preselectProductId || typeof PRODUCTS === 'undefined') return null;
    const preselectProduct = PRODUCTS.find(p => p.id === preselectProductId);
    if(!preselectProduct) return null;
    serviceSelect.value = preselectProduct.category;
    return preselectProduct.id;
  }

  renderProductOptions(getPreselectedProductIdFromUrl());

  /* ---------------------------------------------------------------------
   * Validace a odeslání poptávkového formuláře
   * ------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  /**
   * Zkontroluje vyplněná pole poptávkového formuláře (jméno, telefon, e-mail)
   * a do příslušných elementů s chybovými hláškami vypíše, co je špatně.
   * @returns {boolean} true, pokud jsou všechna pole v pořádku
   */
  function validateContactForm(){
    let valid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    const errName = document.getElementById('err-name');
    const errPhone = document.getElementById('err-phone');
    const errEmail = document.getElementById('err-email');
    errName.textContent = ''; errPhone.textContent = ''; errEmail.textContent = '';

    if(name.value.trim().length < 2){ errName.textContent = 'Zadejte prosím jméno.'; valid = false; }
    const phoneDigits = phone.value.replace(/\s+/g,'');
    if(!/^\+?\d{6,}$/.test(phoneDigits)){ errPhone.textContent = 'Zadejte platné telefonní číslo.'; valid = false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ errEmail.textContent = 'Zadejte platný e-mail.'; valid = false; }

    return valid;
  }

  /** Po úspěšném odeslání zobrazí potvrzovací hlášku a po chvíli ji zase skryje. */
  function showFormSuccessMessage(){
    formMsg.classList.add('show');
    setTimeout(()=> formMsg.classList.remove('show'), 6000);
  }

  /**
   * Zpracuje odeslání poptávkového formuláře: ověří pole, a pokud jsou
   * v pořádku, "odešle" poptávku (v této ukázkové verzi jen vypíše
   * potvrzení a vyresetuje formulář — napojení na e-mail/CRM se doplní
   * podle toho, jaké řešení si kamarád zvolí).
   * @param {SubmitEvent} event
   */
  function handleContactFormSubmit(event){
    event.preventDefault();
    if(!validateContactForm()){
      formMsg.classList.remove('show');
      return;
    }
    showFormSuccessMessage();
    form.reset();
    renderProductOptions();
    document.querySelectorAll('.product-chip.checked').forEach(chip => chip.classList.remove('checked'));
  }

  form.addEventListener('submit', handleContactFormSubmit);

  /* ---------------------------------------------------------------------
   * Drobnosti
   * ------------------------------------------------------------------- */

  /** Vyplní aktuální rok do patičky (copyright). */
  function setFooterYear(){
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  setFooterYear();

})();
