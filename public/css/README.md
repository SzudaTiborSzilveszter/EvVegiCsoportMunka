# CSS Modulok Dokumentáció

A `style.css` szétbontva modularizált CSS fájlokra.

## Fájlszerkezet

```
public/
├── css/
│   ├── global.css                 # Globális stílusok (reset, body)
│   ├── dialog.css                 # Dialog system (panel, overlay, sprites)
│   ├── minigame.css               # Minigame panel és UI elemek
│   ├── scene.css                  # Scene manager és karakterek
│   ├── hacking.css                # Hacking game (grid, cellek, target)
│   └── puzzle-lockpicking.css     # Puzzle és Lockpicking játékok
├── index.html
└── style.css (ARCHIVÁLT - már nem szükséges)
```

## Modulok leírása

### 1. **global.css**
- Reset CSS rules (margin, padding, box-sizing)
- Body alapstílusok (font, háttér, szín)
- Teljes oldal beállítások

### 2. **dialog.css**
- Dialog panel stílusai
- Karakternév és dialógus szöveg
- Választási gombok és Next gomb
- Dialog overlay (fade effect)
- Karakter spritok (bal/jobb oldali animációk)
- Scrollbar stílusok

### 3. **minigame.css**
- Minigame panel fő konténer
- Header, content, footer elrendezés
- Cím és nehézségi szint
- Timer és cancel gomb
- Sikeres/sikertelen üzenetek (pulse animáció)

### 4. **scene.css**
- Scene container és háttér
- Karakterek pozícionálása
- Sprite animációk és drop shadow effektusok
- Hover effektusok karakterekre

### 5. **hacking.css**
- Hacking game konténer
- Grid és cella stílusok
- Cell state-ek (normal, hover, selected, target)
- Target code lista
- Progress indicator

### 6. **puzzle-lockpicking.css**
- Lockpicking SVG kontainer
- Lock gyűrű és route elemek
- Lock gate és entry dot
- Puzzle tile stílusok
- Tile connector vizualizáció
- Meta információk (title, hint, progress)

## Importálás

Az `index.html` fájlban az összes CSS modul importálva van:

```html
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/dialog.css">
<link rel="stylesheet" href="css/minigame.css">
<link rel="stylesheet" href="css/scene.css">
<link rel="stylesheet" href="css/hacking.css">
<link rel="stylesheet" href="css/puzzle-lockpicking.css">
```

## Előnyök

✅ **Könnyebb karbantartás** - Egyes modulok könnyebben szerkeszthetőek  
✅ **Jobb szervezettség** - Logikai csoportosítás funkcionalitás alapján  
✅ **Csökkentett redundancia** - Nincs duplikált stílus  
✅ **Könnyebb feladatmegosztás** - Csapat tagjainak különböző modulok  
✅ **Gyorsabb fejlesztés** - Csak a szükséges CSS modul módosítása  

## Megjegyzés

Az eredeti `style.css` meg lehet tartani backupnak vagy törölni lehet, ha az új modularizált verzió teljesen működik.
