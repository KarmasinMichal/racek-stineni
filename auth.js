/**
 * auth.js — jednoduchá ochrana webu heslem na straně prohlížeče.
 *
 * DŮLEŽITÉ UPOZORNĚNÍ: Tohle NENÍ opravdové zabezpečení, jen "zástěna"
 * proti běžným návštěvníkům a vyhledávačům. Web je statický (bez
 * vlastního serveru) — celý jeho obsah (HTML, texty, fotky) se vždy musí
 * stáhnout do prohlížeče, aby ho tenhle skript mohl schovat. Kdokoli
 * technicky zdatný se přesto může podívat na obsah i bez hesla, např.
 * přes "Zobrazit zdrojový kód stránky", vypnutím JavaScriptu, nebo tím,
 * že se podívá přímo do tohoto souboru (ten je veřejně dostupný stejně
 * jako zbytek webu) — samotné heslo tam je vidět v čitelné podobě.
 * Pro opravdové zabezpečení by bylo potřeba ověřovat heslo na serveru,
 * což GitHub Pages jako čistě statický hosting neumožňuje.
 */
(function passwordGate(){
  /** Heslo, které je potřeba zadat pro vstup na web. */
  var CORRECT_PASSWORD = 'Racek9616';
  /** Klíč v sessionStorage, pod kterým se pamatuje úspěšné přihlášení. */
  var STORAGE_KEY = 'stineniRacekAuthOK';

  /**
   * Zjistí, jestli si tenhle prohlížeč v aktuální relaci (dokud je otevřená
   * karta/okno) už dřív zapamatoval úspěšné zadání hesla.
   * @returns {boolean}
   */
  function isUnlocked(){
    try{ return sessionStorage.getItem(STORAGE_KEY) === '1'; }catch(err){ return false; }
  }

  /** Odemkne obsah stránky a schová přihlašovací obrazovku. */
  function unlockPage(){
    try{ sessionStorage.setItem(STORAGE_KEY, '1'); }catch(err){ /* soukromý režim apod. */ }
    document.documentElement.classList.add('auth-ok');
    var gate = document.getElementById('authGate');
    if(gate) gate.remove();
  }

  /** Zobrazí chybovou hlášku po zadání špatného hesla. */
  function showWrongPasswordMessage(){
    var errorEl = document.getElementById('authError');
    if(errorEl) errorEl.textContent = 'Nesprávné heslo, zkuste to prosím znovu.';
  }

  /**
   * Zpracuje odeslání přihlašovacího formuláře — porovná zadané heslo
   * a buď odemkne stránku, nebo zobrazí chybu.
   * @param {SubmitEvent} event
   */
  function handlePasswordSubmit(event){
    event.preventDefault();
    var passwordInput = document.getElementById('authPassword');
    if(passwordInput && passwordInput.value === CORRECT_PASSWORD){
      unlockPage();
    }else{
      showWrongPasswordMessage();
      if(passwordInput){ passwordInput.value = ''; passwordInput.focus(); }
    }
  }

  /** Vstupní bod — po načtení stránky buď rovnou odemkne, nebo zapne formulář. */
  function initPasswordGate(){
    if(isUnlocked()){
      unlockPage();
      return;
    }
    var form = document.getElementById('authForm');
    if(form) form.addEventListener('submit', handlePasswordSubmit);
    var passwordInput = document.getElementById('authPassword');
    if(passwordInput) passwordInput.focus();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPasswordGate);
  }else{
    initPasswordGate();
  }
})();
