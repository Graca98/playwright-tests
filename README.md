# Playwright Test Project

Tento repozitář obsahuje ukázkové end-to-end testy napsané v Playwrightu.  
Testují chování webových prvků na stránkách z [The Internet Herokuapp](https://the-internet.herokuapp.com/).

## 📁 Struktura testů

- **e2e/entry_ad.spec.js**  
  Testuje modální okno (Entry Ad modal):
  - Zobrazení modálního okna při načtení stránky.
  - Zavření modálního okna a ověření, že se znovu nezobrazí.

- **e2e/add_remove_elements.spec.js**  
  Testuje přidávání a odebírání tlačítek:
  - Přidání jednoho a více prvků.
  - Mazání jednotlivých i všech přidaných prvků.
  - Ověření, že na začátku nejsou žádná tlačítka „Delete“.

- **e2e/login_page.spec.js**  
  Testuje přihlašovací stránku:
  - Přihlášení s validními údaji.
  - Ověření chybových hlášek při nevalidních údajích (prázdné vstupy, špatné heslo).
  - Testování odolnosti na XSS a speciální znaky.
  - Kontrola chování po více špatných pokusech přihlášení.

## 🚀 Spuštění testů

1. Nainstaluj závislosti:
   ```bash
   npm install

2. Spusť všechny testy:
   npx playwright test

