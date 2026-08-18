Fotky produktů — jak to funguje
================================

Každý produkt má vlastní podsložku pojmenovanou podle jeho "id" (technického
názvu bez diakritiky a mezer, stejného jako u textů v texts/). Seznam všech
produktů a jejich id najdeš v souboru products-data.js v hlavní složce webu
(sloupec "id" u každého produktu).

V každé podsložce jsou dva druhy věcí:

1. Samotné fotky, pojmenované "normálně" — číslo, pomlčka, název, přípona:

     1 - Látková roleta v ložnici.jpg
     2 - Detail ovládacího řetízku.jpg
     3 - Barevné varianty látky.jpg

   Číslo na začátku určuje jen POŘADÍ fotky (1 = hlavní fotka nahoře na
   stránce produktu, 2, 3, 4... = fotogalerie pod hlavním textem) — na webu
   se nikde nezobrazuje. Zobrazí se jen text za pomlčkou (bez čísla), a to
   jako popisek fotky. Podporované přípony jsou .jpg, .jpeg, .png a .webp.

2. Soubor "photos.txt" — obyčejný textový seznam, který webu řekne, které
   fotky má použít a v jakém pořadí. Na každý řádek napiš přesný název
   jednoho souboru fotky, přesně tak, jak se jmenuje (i s diakritikou):

     1 - Látková roleta v ložnici.jpg
     2 - Detail ovládacího řetízku.jpg
     3 - Barevné varianty látky.jpg

   Tento soubor je nutný, protože webové stránky si samy o sobě nemohou
   "podívat do složky", co v ní je — musí přesně vědět, jaké soubory tam
   jsou. photos.txt to řekne. V každé podsložce produktu už je připravená
   ukázka souboru photos.txt — stačí ji přepsat podle skutečných fotek,
   které tam nahraješ.

Shrnutí pro kamaráda:
  - Nahraj fotky do složky produktu, pojmenované "číslo - název.přípona".
  - Do photos.txt vypiš přesné názvy těch souborů, v pořadí, v jakém se
    mají zobrazit (řádek = jedna fotka).
  - Žádnou úpravu kódu není potřeba dělat.

Dokud v nějaké složce fotky/photos.txt nejsou (nebo je photos.txt prázdný),
použije se na webu náhradní ukázková fotka z internetu, aby stránka
nevypadala prázdně.
