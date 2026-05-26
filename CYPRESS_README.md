# Cypress Tesztek - Útmutató

## Telepítés

A Cypress már telepítve van. Ha nem lenne, futtasd:
```bash
npm install --save-dev cypress
```

## Tesztek futtatása

### Interactive mód (ajánlott fejlesztéshez)
```bash
npx cypress open
```
Ezután válaszd a **E2E Testing**-et és kattints a `game.cy.js`-re.

### Headless mód (CI/CD-hez)
```bash
npx cypress run
```

### Specifikus teszt futtatása
```bash
npx cypress run --spec "cypress/e2e/game.cy.js"
```

## Mit tesztelnek?

### Game Loading & UI
- ✅ Játék betöltése és főmenü megjelenítése
- ✅ Jelenet megjelenítése START gomb után
- ✅ Karakter sprite-ok megjelenítése

### Dialog System
- ✅ Dialog panel megjelenítése kattintásra
- ✅ Karakternév helyes megjelenítése (Jia, Liam, stb.)
- ✅ Választási lehetőségek kattinthatósága
- ✅ "Tovább" gomb megjelenítése, amikor nincs választás
- ✅ Dialog progresszió működése

### Scene Navigation
- ✅ Exit gombokkal jelenetváltás
- ✅ Jelenet pozíciók frissülése
- ✅ Karakter státusz megőrzése

### UI Elements
- ✅ Dialóg sprite animációk
- ✅ Centered solo karaktermegjelenítés (csak Tovább gomb)
- ✅ Settings menü megnyitása/zárása
- ✅ Hangerő csúszka kezelése

### Audio
- ✅ Ambient zene lejátszása
- ✅ Audio elemek létezése

## Tesztek módosítása

A tesztek a `cypress/e2e/game.cy.js` fájlban találhatók. 
Egyedi parancsok a `cypress/support/commands.js` fájlban vannak.

### Custom Commands
```javascript
cy.startGame();           // Játék indítása
cy.clickCharacter(0);     // Karakter kattintása (index)
cy.selectChoice(0);       // Választás kiválasztása
cy.clickTovabb();         // Tovább gomb kattintása
cy.isDialogVisible();     // Dialog látható-e?
cy.closeDialog();         // Dialog bezárása
```

## Hibaelhárítás

### "Cannot find element" hibák
- Győződj meg, hogy a játék betöltött (wait parancsok elég hosszúak-e)
- Ellenőrizd a CSS selectorokat az aktuális HTML-ben

### Screenshot/Video
A Cypress automatikusan elmentett hibás tesztek screenshotjait:
```
cypress/screenshots/
cypress/videos/
```

## Előfeltételek

1. A játékot egy webszerveren kell futtatni (pl. `http-server`)
   ```bash
   npx http-server -p 8000
   ```

2. A `cypress.config.js`-ben a `baseUrl` helyes-e
3. A `test.html` elérhető `http://localhost:8000/test.html`-en
