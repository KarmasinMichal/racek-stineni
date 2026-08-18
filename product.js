/**
 * product.js — JavaScript pro dynamickou stránku produktu (product.html).
 * Podle parametru ?id= v adrese vykreslí konkrétní produkt: data (název,
 * kategorie, obrázek) bere z products-data.js, popisný text a vlastnosti
 * načte za běhu ze souboru texts/<id>.txt.
 *
 * Očekává, že v <head>/na konci <body> je před tímto souborem načtený
 * products-data.js (definuje globální proměnnou PRODUCTS, funkce
 * getProductById a loadProductText).
 */

/** Vyplní aktuální rok do patičky (copyright). */
function setFooterYear(){
  document.getElementById('year').textContent = new Date().getFullYear();
}

/**
 * Zjistí id produktu z URL adresy (parametr ?id=...).
 * @returns {string|null} id produktu, nebo null když v adrese chybí
 */
function getProductIdFromUrl(){
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Vykreslí stránku "Produkt jsme nenašli" pro neplatné nebo neexistující id.
 * @param {HTMLElement} root - element, do kterého se má obsah vložit
 */
function renderProductNotFound(root){
  const notFoundTpl = document.getElementById('notFoundTemplate');
  root.appendChild(notFoundTpl.content.cloneNode(true));
  document.getElementById('breadcrumbCurrent').textContent = 'Nenalezeno';
  document.title = 'Produkt nenalezen | Stínění Ráček';
}

/**
 * Vyplní základní údaje o produktu (obrázek, kategorie, název, popis)
 * do naklonované šablony #productTemplate.
 * @param {DocumentFragment} templateNode - naklonovaný obsah šablony
 * @param {Object} product - záznam produktu z products-data.js
 * @param {Object} text - rozparsovaný text produktu (shortDesc, longDesc, features)
 * @param {string} heroImageUrl - adresa hlavní fotky (fotka č. 1 ze souboru
 *   images/<id>/photos.txt, nebo záložní obrázek product.image, když
 *   produkt žádné vlastní fotky nemá)
 * @param {string} heroImageTitle - popisek hlavní fotky (název z photos.txt,
 *   bez čísla), použije se jako alt/title; když fotka nemá vlastní název,
 *   použije se název produktu
 */
function fillProductBasicInfo(templateNode, product, text, heroImageUrl, heroImageTitle){
  const heroAlt = heroImageTitle || product.name;
  templateNode.querySelector('#tplImage').src = heroImageUrl;
  templateNode.querySelector('#tplImage').alt = heroAlt;
  templateNode.querySelector('#tplImage').title = heroAlt;
  templateNode.querySelector('#tplCategory').textContent = product.category;
  templateNode.querySelector('#tplName').textContent = product.name;
  templateNode.querySelector('#tplNameInline').textContent = product.name.toLowerCase();
  templateNode.querySelector('#tplLongDesc').textContent = text.longDesc || text.shortDesc;
}

/**
 * Nastaví odkazy poptávkových tlačítek tak, aby vedly rovnou na kontaktní
 * formulář s předvyplněným produktem (index.html?product=<id>#contact) —
 * index.html si podle tohoto parametru sám zaškrtne odpovídající kategorii
 * i konkrétní produkt.
 * @param {DocumentFragment} templateNode - naklonovaný obsah šablony
 * @param {Object} product - záznam produktu z products-data.js
 */
function wireUpInquiryButtons(templateNode, product){
  const contactUrl = 'index.html?product=' + encodeURIComponent(product.id) + '#contact';
  const poptatBtn = templateNode.querySelector('#tplPoptatBtn');
  if(poptatBtn) poptatBtn.href = contactUrl;
  const ctaBtn = templateNode.querySelector('#tplCtaBtn');
  if(ctaBtn) ctaBtn.href = contactUrl;
}

/**
 * Vykreslí seznam klíčových vlastností produktu do mřížky #tplFeatureGrid.
 * @param {DocumentFragment} templateNode - naklonovaný obsah šablony
 * @param {string[]} features - seznam vlastností produktu
 */
function renderFeatureList(templateNode, features){
  const featureGrid = templateNode.querySelector('#tplFeatureGrid');
  features.forEach(feature=>{
    const item = document.createElement('div');
    item.className = 'feature-item';
    item.textContent = feature;
    featureGrid.appendChild(item);
  });
}

/**
 * Vytvoří jednu kartičku souvisejícího produktu (odkaz s obrázkem a popisem).
 * @param {Object} relatedProduct - záznam souvisejícího produktu
 * @param {string} shortDesc - jeho krátký popis (načtený z texts/<id>.txt)
 * @returns {HTMLAnchorElement}
 */
function createRelatedProductCard(relatedProduct, shortDesc){
  const card = document.createElement('a');
  card.href = 'product.html?id=' + encodeURIComponent(relatedProduct.id);
  card.className = 'related-card';
  card.innerHTML =
    '<div class="img-wrap"><img src="' + relatedProduct.image + '" alt="' + relatedProduct.name + '"></div>' +
    '<div class="body"><h3>' + relatedProduct.name + '</h3><p>' + (shortDesc || '') + '</p></div>';
  return card;
}

/**
 * Najde a vykreslí až tři další produkty ze stejné kategorie (s náhledem
 * jejich krátkého popisu). Pokud žádné nejsou, zobrazí informační text.
 * @param {DocumentFragment} templateNode - naklonovaný obsah šablony
 * @param {Object} product - aktuální produkt (vylučuje se sám ze seznamu)
 */
async function renderRelatedProducts(templateNode, product){
  const relatedGrid = templateNode.querySelector('#tplRelatedGrid');
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  if(related.length === 0){
    const emptyMessage = document.createElement('p');
    emptyMessage.style.color = 'var(--gray)';
    emptyMessage.textContent = 'Další produkty z této kategorie připravujeme.';
    relatedGrid.appendChild(emptyMessage);
    return;
  }

  // Ke každému souvisejícímu produktu si dotáhneme i jeho krátký popis.
  const relatedTexts = await Promise.all(related.map(r => loadProductText(r.id)));
  related.forEach((relatedProduct, index)=>{
    const card = createRelatedProductCard(relatedProduct, relatedTexts[index].shortDesc);
    relatedGrid.appendChild(card);
  });
}

/**
 * Nastaví title stránky, meta popisek a text v drobečkové navigaci
 * podle vykresleného produktu.
 * @param {Object} product - záznam produktu z products-data.js
 * @param {Object} text - rozparsovaný text produktu (shortDesc, longDesc, features)
 */
function updatePageMetadata(product, text){
  document.title = product.name + ' | Stínění Ráček';
  document.getElementById('pageTitle').textContent = product.name + ' | Stínění Ráček';
  document.getElementById('pageDesc').setAttribute('content', text.shortDesc || product.name);
  document.getElementById('breadcrumbCurrent').textContent = product.name;
}

/**
 * Callback IntersectionObserveru pro sekce s třídou .reveal — jakmile
 * prvek vjede do viewportu, přidá mu třídu "in" (spustí CSS animaci)
 * a přestane ho dál sledovat.
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
function revealElementsOnScroll(entries, observer){
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}

/** Zapne fade-in animaci pro všechny prvky s třídou .reveal na stránce. */
function initRevealAnimations(){
  const observer = new IntersectionObserver(revealElementsOnScroll, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------
 * Fotogalerie produktu a lightbox
 *
 * Fotka č. 1 ze složky images/<id>/ je hlavní fotka nahoře na stránce
 * (viz fillProductBasicInfo). Fotky 2, 3, 4, ... se zobrazí v mřížce
 * fotogalerie pod hlavním textem — po kliknutí na kteroukoli z nich se
 * otevře lightbox s možností listovat šipkami nebo klávesnicí.
 * ---------------------------------------------------------------------- */

/** Fotky aktuálně otevřené v lightboxu (jen ty z fotogalerie, bez hlavní fotky) — pole {url, title}. */
let lightboxPhotos = [];
/** Index fotky, která je v lightboxu právě zobrazená. */
let lightboxIndex = 0;

/** Přepíše obrázek a popisek v lightboxu podle aktuálně zvoleného indexu. */
function updateLightboxContent(){
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const photo = lightboxPhotos[lightboxIndex];
  lbImg.src = photo.url;
  lbImg.alt = photo.title;
  lbCaption.textContent = photo.title;
}

/**
 * Otevře lightbox na fotce s daným indexem v poli lightboxPhotos.
 * @param {number} index - pořadí fotky v galerii (bez hlavní fotky)
 */
function openLightbox(index){
  lightboxIndex = index;
  updateLightboxContent();
  document.getElementById('lightbox').classList.add('open');
}

/** Zavře lightbox. */
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
}

/** Přepne lightbox na předchozí fotku v galerii (cyklicky). */
function showPreviousLightboxImage(){
  lightboxIndex = (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
  updateLightboxContent();
}

/** Přepne lightbox na další fotku v galerii (cyklicky). */
function showNextLightboxImage(){
  lightboxIndex = (lightboxIndex + 1) % lightboxPhotos.length;
  updateLightboxContent();
}

/**
 * Zavře lightbox při kliknutí mimo fotku (na tmavé pozadí).
 * @param {MouseEvent} event
 */
function handleLightboxBackdropClick(event){
  if(event.target.id === 'lightbox'){ closeLightbox(); }
}

/**
 * Ovládání lightboxu klávesnicí — Escape zavře, šipky листují fotky.
 * @param {KeyboardEvent} event
 */
function handleLightboxKeydown(event){
  const lightbox = document.getElementById('lightbox');
  if(!lightbox.classList.contains('open')) return;
  if(event.key === 'Escape') closeLightbox();
  if(event.key === 'ArrowLeft') showPreviousLightboxImage();
  if(event.key === 'ArrowRight') showNextLightboxImage();
}

/** Jednorázově napojí ovládací prvky lightboxu (zavřít, šipky, klávesnice, klik mimo). */
function initLightboxControls(){
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', showPreviousLightboxImage);
  document.getElementById('lbNext').addEventListener('click', showNextLightboxImage);
  document.getElementById('lightbox').addEventListener('click', handleLightboxBackdropClick);
  document.addEventListener('keydown', handleLightboxKeydown);
}

/**
 * Vykreslí mřížku fotogalerie z fotek 2+ (fotka 1 je hlavní fotka nahoře).
 * Pokud produkt žádné další fotky nemá, celou sekci fotogalerie odstraní.
 * @param {DocumentFragment} templateNode - naklonovaný obsah šablony
 * @param {{url: string, title: string}[]} galleryPhotos - fotky 2, 3, 4, ... (bez hlavní fotky)
 * @param {string} productName - název produktu, použije se jako záložní alt text,
 *   pokud fotka nemá vlastní název
 */
function renderProductGallery(templateNode, galleryPhotos, productName){
  const gallerySection = templateNode.querySelector('#tplGallerySection');
  if(galleryPhotos.length === 0){
    gallerySection.remove();
    return;
  }
  lightboxPhotos = galleryPhotos;
  const galleryGrid = templateNode.querySelector('#tplGalleryGrid');
  galleryPhotos.forEach((photo, index)=>{
    const altText = photo.title || productName;
    const figure = document.createElement('figure');
    figure.innerHTML = '<img src="' + photo.url + '" alt="' + altText + '" title="' + altText + '">';
    figure.addEventListener('click', ()=> openLightbox(index));
    galleryGrid.appendChild(figure);
  });
}

/**
 * Vykreslí kompletní stránku nalezeného produktu: vyplní šablonu daty,
 * poptávkové odkazy, fotogalerii, vlastnosti, související produkty
 * a metadata stránky.
 * @param {HTMLElement} root - element, do kterého se má obsah vložit
 * @param {Object} product - záznam produktu z products-data.js
 */
async function renderProductPage(root, product){
  // Text produktu (krátký popis, dlouhý popis, vlastnosti) se načítá
  // ze samostatného souboru texts/<id>.txt — viz products-data.js.
  const text = await loadProductText(product.id);

  // Fotky produktu se čtou ze souboru images/<id>/photos.txt — fotka č. 1
  // je hlavní, zbytek jde do fotogalerie. Když soubor chybí nebo je
  // prázdný, použije se záložní obrázek product.image z products-data.js.
  const photos = await loadProductPhotos(product.id);
  const heroImageUrl = photos.length > 0 ? photos[0].url : product.image;
  const heroImageTitle = photos.length > 0 ? photos[0].title : product.name;
  const galleryPhotos = photos.slice(1);

  const template = document.getElementById('productTemplate');
  const templateNode = template.content.cloneNode(true);

  fillProductBasicInfo(templateNode, product, text, heroImageUrl, heroImageTitle);
  wireUpInquiryButtons(templateNode, product);
  renderProductGallery(templateNode, galleryPhotos, product.name);
  renderFeatureList(templateNode, text.features);
  await renderRelatedProducts(templateNode, product);

  root.appendChild(templateNode);
  updatePageMetadata(product, text);
  initLightboxControls();
  initRevealAnimations();
}

/** Vstupní bod skriptu — spustí se po načtení stránky produktu. */
async function initProductPage(){
  setFooterYear();

  const id = getProductIdFromUrl();
  const product = typeof getProductById === 'function' ? getProductById(id) : null;
  const root = document.getElementById('productRoot');

  if(!product){
    renderProductNotFound(root);
    return;
  }

  await renderProductPage(root, product);
}

initProductPage();
