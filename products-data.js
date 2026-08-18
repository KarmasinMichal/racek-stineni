/* Centrální seznam produktů — jen základní údaje (id, kategorie, název, obrázek).
   Popisný text a vlastnosti každého produktu jsou v samostatných textových
   souborech ve složce texts/ — díky tomu je může kamarád upravovat v obyčejném
   Poznámkovém bloku, bez zásahu do kódu.

   Formát textového souboru texts/<id>.txt:
     1. řádek           = krátký popis (používá se v seznamech a náhledech)
     prázdný řádek
     odstavec            = dlouhý popis (zobrazí se na stránce produktu)
     prázdný řádek
     "Vlastnosti:"       + řádky začínající "- " = seznam vlastností

   Fotky produktu se berou ze složky images/<id>/ — viz loadProductPhotos()
   níže. Seznam fotek a jejich pořadí určuje textový soubor
   images/<id>/photos.txt, kde je na každém řádku název jednoho souboru
   ve formátu "<číslo> - <název fotky>.<přípona>", např.:
     1 - Látková roleta v ložnici.jpg
     2 - Detail ovládacího řetízku.jpg
   Číslo určuje jen POŘADÍ (1 = hlavní fotka na stránce produktu, další
   čísla = fotogalerie pod hlavním textem) a nikde se nezobrazuje — jako
   popisek fotky (alt/title u obrázku) se použije jen text za pomlčkou.
   Pokud produkt žádné vlastní fotky nemá (nebo soubor photos.txt
   chybí/je prázdný), použije se záložní obrázek image z definice
   produktu níže.
*/
const PRODUCTS = [
  // ---------- Venkovní stínění ----------
  { id: "venkovni-zaluzie",        category: "Venkovní stínění",     name: "Venkovní žaluzie",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop" },
  { id: "screenove-rolety",        category: "Venkovní stínění",     name: "Screenové rolety",
    image: "https://images.unsplash.com/photo-1600566752734-2a0cd53f1c8e?q=80&w=1200&auto=format&fit=crop" },
  { id: "predokenni-alu-rolety",   category: "Venkovní stínění",     name: "Předokenní alu rolety",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1200&auto=format&fit=crop" },
  { id: "pergoly",                 category: "Venkovní stínění",     name: "Pergoly",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop" },
  { id: "markyzy",                 category: "Venkovní stínění",     name: "Markýzy",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop" },
  { id: "rolovaci-garazova-vrata", category: "Venkovní stínění",     name: "Rolovací garážová vrata",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop" },

  // ---------- Interiérové stínění ----------
  { id: "rolety",                  category: "Interiérové stínění",  name: "Rolety",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" },
  { id: "plise-stineni",           category: "Interiérové stínění",  name: "Plisé stínění",
    image: "https://images.unsplash.com/photo-1600566752229-450a10a97b47?q=80&w=1200&auto=format&fit=crop" },
  { id: "rimske-rolety",           category: "Interiérové stínění",  name: "Římské rolety",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" },
  { id: "stropni-stineni",         category: "Interiérové stínění",  name: "Stropní stínění (roletové a baldachýny)",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop" },
  { id: "vertikalni-zaluzie",      category: "Interiérové stínění",  name: "Vertikální žaluzie",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop" },
  { id: "zaluzie-hlinikove",       category: "Interiérové stínění",  name: "Žaluzie hliníkové",
    image: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1200&auto=format&fit=crop" },
  { id: "zaluzie-drevene",         category: "Interiérové stínění",  name: "Žaluzie dřevěné",
    image: "https://images.unsplash.com/photo-1600566752229-450a10a97b47?q=80&w=1200&auto=format&fit=crop" },
  { id: "zaclony-zavesy",          category: "Interiérové stínění",  name: "Záclony, závěsy",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" },
  { id: "zaclonove-kolejnice",     category: "Interiérové stínění",  name: "Záclonové a závěsové kolejnice",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop" },
  { id: "japonske-panely",         category: "Interiérové stínění",  name: "Japonské panelové posuvné stěny",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop" },

  // ---------- Sítě proti hmyzu ----------
  { id: "site-okenni",             category: "Sítě proti hmyzu",     name: "Okenní sítě proti hmyzu",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop" },
  { id: "site-dverni",             category: "Sítě proti hmyzu",     name: "Dveřní sítě proti hmyzu (křídlové nebo plisé)",
    image: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1200&auto=format&fit=crop" },

  // ---------- Servis stínicí techniky ----------
  { id: "servis-serizeni",         category: "Servis stínicí techniky", name: "Seřízení a promazání pohonů",
    image: "https://images.unsplash.com/photo-1620912189866-3c469057b4f0?q=80&w=1200&auto=format&fit=crop" },
  { id: "servis-oprava-dilu",      category: "Servis stínicí techniky", name: "Oprava a výměna dílů",
    image: "https://images.unsplash.com/photo-1581092160607-ee22731c9c8c?q=80&w=1200&auto=format&fit=crop" },
  { id: "servis-cisteni",          category: "Servis stínicí techniky", name: "Čištění lamel a látek",
    image: "https://images.unsplash.com/photo-1600566752734-2a0cd53f1c8e?q=80&w=1200&auto=format&fit=crop" }
];

/**
 * Najde základní záznam produktu podle jeho id (bez popisného textu —
 * ten se dotahuje zvlášť funkcí loadProductText).
 * @param {string} id - id produktu, např. "venkovni-zaluzie"
 * @returns {Object|undefined} záznam produktu z pole PRODUCTS, nebo undefined
 */
function getProductById(id){
  return PRODUCTS.find(p => p.id === id);
}

/**
 * Načte a rozparsuje textový soubor texts/<id>.txt.
 * Pokud soubor nejde načíst (např. web běží z file:// bez serveru), vrátí prázdné texty.
 * @param {string} id - id produktu, podle kterého se dohledá texts/<id>.txt
 * @returns {Promise<{shortDesc: string, longDesc: string, features: string[]}>}
 */
async function loadProductText(id){
  try{
    const res = await fetch('texts/' + id + '.txt');
    if(!res.ok) throw new Error('Text soubor nenalezen: ' + id);
    const raw = await res.text();
    return parseProductText(raw);
  }catch(err){
    console.warn('Nepodařilo se načíst text produktu "' + id + '":', err);
    return { shortDesc: '', longDesc: '', features: [] };
  }
}

/**
 * Rozparsuje syrový obsah textového souboru texts/<id>.txt (viz formát
 * popsaný v hlavičce tohoto souboru) na strukturovaný objekt.
 * @param {string} raw - obsah textového souboru tak, jak přišel z fetch()
 * @returns {{shortDesc: string, longDesc: string, features: string[]}}
 */
function parseProductText(raw){
  const blocks = raw.replace(/\r\n/g, '\n').trim().split(/\n\s*\n/);
  const shortDesc = (blocks[0] || '').trim();
  const longDesc = (blocks[1] || '').trim();
  const featuresBlock = blocks[2] || '';
  const features = featuresBlock
    .split('\n')
    .map(line => line.replace(/^Vlastnosti:\s*/i, '').trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
  return { shortDesc, longDesc, features };
}

/**
 * Rozparsuje jeden název souboru fotky ve formátu "<číslo> - <název>.<přípona>"
 * (např. "1 - Látková roleta v ložnici.jpg") na pořadové číslo, čitelný
 * název (bez čísla — ten se použije jako alt/title obrázku) a původní
 * název souboru.
 * @param {string} filename - jeden řádek ze souboru images/<id>/photos.txt
 * @returns {{number: number, title: string, filename: string}|null} rozparsovaný
 *   záznam, nebo null když řádek neodpovídá očekávanému formátu
 */
function parsePhotoFilename(filename){
  const match = filename.match(/^(\d+)\s*-\s*(.+?)\.\w+$/);
  if(!match) return null;
  return {
    number: parseInt(match[1], 10),
    title: match[2].trim(),
    filename: filename
  };
}

/**
 * Načte a rozparsuje seznam fotek produktu ze souboru images/<id>/photos.txt.
 * Každý řádek souboru je název jednoho souboru fotky ve formátu
 * "<číslo> - <název fotky>.<přípona>" (viz hlavička souboru výše). Fotky se
 * vrátí seřazené podle čísla — číslo samotné se ale nikam do zobrazeného
 * textu nepřenáší, slouží jen k určení pořadí (fotka č. 1 je hlavní fotka
 * produktu, zbytek jde do fotogalerie — o toto rozdělení se stará volající
 * kód v product.js).
 * @param {string} id - id produktu (název podsložky ve složce images/)
 * @returns {Promise<{url: string, title: string}[]>} pole fotek v pořadí 1, 2, 3, ...,
 *   každá s adresou (url) a čitelným názvem (title) pro alt/title obrázku
 */
async function loadProductPhotos(id){
  try{
    const res = await fetch('images/' + id + '/photos.txt');
    if(!res.ok) return [];
    const raw = await res.text();
    return raw
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'))
      .map(parsePhotoFilename)
      .filter(Boolean)
      .sort((a, b) => a.number - b.number)
      .map(photo => ({ url: 'images/' + id + '/' + photo.filename, title: photo.title }));
  }catch(err){
    console.warn('Nepodařilo se načíst seznam fotek produktu "' + id + '":', err);
    return [];
  }
}
