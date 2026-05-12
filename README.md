# 🌌 Liam/Jia Cyler - Cyberpunk Visual Novel

**Egy nyomasztó atmoszférájú webes játék**, amit a *Serial Experiments Lain* és *Cyberpunk 2077* esztétikája ihlet. Vizuális novella, ahol a te választásaid formálják a főszereplő személyiségét és sorsát.

---

## 📖 Sztorivázlat

Egy fekete piacon szerzett kibernetikus implant miatt hallucinációkat élsz meg. Az implant állandó fájdalmat okoz, ami negatívan hat személyiségedre – alapvetően jószívű vagy, de a helyzet miatt gyakran durván bánsz az emberekkel.

**Célod:** Találj egy **ripperdocot** és egy működő implantot, hogy végre megszabadulj az "átoktól".

**Twist:** A hallucinációkban megjelenik a testvéred, aki próbál téged a jó úton tartani – de nem mindig működik.

---

## 🎮 Játékmechanikák

### 1. 📢 **Dialógus Rendszer** (Multiple Choice)

A dialógusok **nested objektumlisták**, ahol minden válasz egy `nextDialog` indexet tartalmaz, amely a következő dialógust mutatja.

**Koncepció (Inventory slot analógia):**
- Minden dialógus egy "inventory slotban" van (`dialogs` array)
- Amikor választasz, az index alapján a rendszer az új slotba ugrik
- Könnyen bővíthető: csak add hozzá az új dialógust az arrayba

**Implementáció (pszeudokód):**
```javascript
/**
 * @typedef {Object} DialogChoice
 * @property {string} text - A válasz szövege
 * @property {number} nextDialog - Az indexe a következő dialógusnak
 * @property {Object} traitModifier - Trait módosítások (pl. {empathy: +5, aggression: -3})
 * 
 * @typedef {Object} Dialog
 * @property {number} id - Dialógus ID
 * @property {string} speaker - Ki beszél (pl. "testvér", "Ripperdoc")
 * @property {string} text - A dialógus szövege
 * @property {DialogChoice[]} choices - Lehetséges válaszok
 */

const dialogs = [
  {
    id: 0,
    speaker: "testvér",
    text: "Mi van? Megint az implant?",
    choices: [
      {
        text: "Igen, szörnyű. Azonnal ki kell venni.",
        nextDialog: 1,
        traitModifier: { empathy: -5, desperation: +3 }
      },
      {
        text: "Nincs semmi. Hagyj békén.",
        nextDialog: 2,
        traitModifier: { empathy: -2, coldness: +2 }
      }
    ]
  },
  // dialógus 1, 2, stb...
];

/**
 * Dialógus megjelenítése
 * @param {number} dialogId - Az aktuális dialógus ID
 * @returns {void}
 */
function showDialog(dialogId) {
  const current = dialogs[dialogId];
  // Karakterkép, szöveg és választások megjelenítése...
  // Válasz kiválasztása után: updateTraits() + showDialog(nextDialog)
}
```

---

### 2. 🧬 **Trait (Tulajdonság) Rendszer**

A főszereplő **5-8 trait-je** van, amely a játékos választásai alapján változik. Bizonyos karakterek, események vagy végkifejletek csak meghatározott trait-szintekkel érhető el.

**Trait Meghatározás (Játékoslélektan analógia):**
- Ez mint egy **szintrendszer karaktered különböző "skill treeiben"**
- Minden választás minusz vagy plussz egyes trait-ekre
- Bizonyos "boss karakterek" (pl. jó/rossz ripperdoc) csak jellemfüggően érhetők el

**Trait Kör:**
- **Empathy** (Empátia): Mennyire segítőkész vagy mások iránt
- **Aggression** (Agresszivitás): Milyen durván bánol az emberekkel
- **Desperation** (Kétségbeesettség): Milyen erős a szükséghelyzet
- **Coldness** (Közömbösség): Mennyire vakmerő vagy szívtelen
- **Trust** (Bizalom): Mennyire bízol az emberekben

**Implementáció:**
```javascript
/**
 * @typedef {Object} CharacterTraits
 * @property {number} empathy - 0-100 (alapértelmezés: 50)
 * @property {number} aggression - 0-100 (alapértelmezés: 40)
 * @property {number} desperation - 0-100 (alapértelmezés: 70)
 * @property {number} coldness - 0-100 (alapértelmezés: 30)
 * @property {number} trust - 0-100 (alapértelmezés: 40)
 */

class KarakterAdatok {
  constructor(nem = "Liam") {
    this.nev = nem;
    this.traits = {
      empathy: 50,
      aggression: 40,
      desperation: 70,
      coldness: 30,
      trust: 40
    };
  }

  /**
   * Ellenőrizd, hogy elérhető-e egy esemény
   * @param {string} eventId - Az esemény azonosítója
   * @returns {boolean} - Elérhető-e
   */
  isEventUnlocked(eventId) {
    const requirements = {
      "goodRipperdoc": { empathy: 60, trust: 70 },
      "blackMarketDealer": { aggression: 60, coldness: 50 }
      // stb.
    };
    
```

---

### 3. 🕹️ **Minigame Rendszer** (Önálló modulok)

A minigamek **nem a dialógus része**, hanem független játékmód, amely az alábbi helyzetekben aktiválódik:
- **Lockpicking**: Zárat kell nyitni
- **Hacking**: Számítógépet kell feltörni
- **Puzzle**: Logikai feladat

**Implementáció:**
```javascript
/**
 * @typedef {Object} Minigame
 * @property {string} type - Minigame típusa ("lockpicking", "hacking", "puzzle")
 * @property {number} difficulty - Nehézség (1-5)
 * @property {string} onSuccess - Dialógus ID siker esetén
 * @property {string} onFailure - Dialógus ID kudarc esetén
 */

class Minigame {
  constructor(type, difficulty, onSuccess, onFailure) {
    this.type = type;
    this.difficulty = difficulty;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  /**
   * Lockpicking minigame
   * (pl. időzített kattintások)
   */
  async lockpickingGame() {
    // UI: Zárnak képe, időzítő, kattintási pontosság
    // Sikerkritérium: X ideális kattintás az Y alatt
    return Math.random() > (this.difficulty / 10);
  }
}
```

---

### 4. 🎒 **Inventory & Tárgyak Rendszer** (Dinamikus)

A játékos tárgyakat vehet fel, dobhat el, és használhat. Egyes tárgyak **stackelhető** (pl. ammo, pénz), mások **egyedi** (pl. kulcsok, quest itemek).

**Implementáció:**
```javascript
/**
 * @typedef {Object} Item
 * @property {string} id - Egyedi azonosító
 * @property {string} name - Tárgy neve
 * @property {boolean} stackable - Stackelhető-e
 * @property {number} quantity - Mennyiség (ha stackable)
 * @property {string} description - Leírás
 * @property {number} rarity - Ritkaság (1-5)
 */

class Inventory {
  constructor(maxSlots = 20) {
    this.items = [];
    this.maxSlots = maxSlots;
  }

  /**
   * Tárgy hozzáadása az inventoryhoz
   * @param {Item} item - Hozzáadandó tárgy
   * @returns {boolean} - Sikerült-e
   */
  addItem(item) {
    // Ha stackable és már van ilyen: add quantity-t
    if (item.stackable) {
      const existing = this.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
        return true;
      }
    }

    // Új slot szükséges
    if (this.items.length >= this.maxSlots) {
      console.log("Inventory tele van!");
      return false;
    }

    this.items.push(item);
    return true;
  }

  /**
   * Tárgy eltávolítása
   * @param {string} itemId - Tárgy ID
   * @param {number} quantity - Mennyi eltávolítandó (stackable-nek)
   */
  removeItem(itemId, quantity = 1) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return false;

    if (item.stackable) {
      item.quantity -= quantity;
      if (item.quantity <= 0) {
        this.items = this.items.filter(i => i.id !== itemId);
      }
    } else {
      this.items = this.items.filter(i => i.id !== itemId);
    }
    return true;
  }

  /**
   * Tárgy használata
   * @param {string} itemId - Tárgy ID
   */
  useItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return false;

    // Item specifikus logika (pl. health potion -> +HP)
    // Ez az "Item" osztályban végzendő el
    return true;
  }
}
```

---

### 5. 🌙 **Ambient Music Hangulatfüggő**

Hangulat alapján különböző zenék:
- **Dialógus**: Szomorú, introspektív elektronika
- **Minigame**: Feszültségnövelő, ritmusba lépő track
- **Szabad felfedezés**: Nyomasztó cyberpunk ambience

---

## 📁 Mappastruktúra

```
/src
  ├── /modules
  │   ├── DialogSystem.js
  │   ├── TraitSystem.js
  │   ├── InventorySystem.js
  │   ├── Minigame.js
  │   ├── AudioManager.js
  │   └── Karakter.js
  ├── /data
  │   ├── dialogs.json (vagy .js)
  │   ├── items.json
  │   ├── traits.json
  │   ├── characters.json
  │   └── minigames.json
  ├── /ui
  │   ├── DialogPanel.js
  │   ├── InventoryUI.js
  │   ├── TraitDisplay.js
  │   └── MinigameUI.js
  ├── /assets
  │   ├── /sprites
  │   ├── /backgrounds
  │   ├── /sounds
  │   ├── /music
  │   └── /fonts
  └── main.js

/public
  ├── index.html
  └── styles.css
```

---

## 🛠️ Osztályok Áttekintése

### **DialogPanel**
Kezeli a dialógus megjelenítést, választások kiválasztását, trait módosításokat.

### **KarakterAdatok**
Tároja a karakterek trait értékeit, egyéb adatait (név, nem, stb.).

### **Karakter** (NPC osztály)
NPC karakterek adatai: dialógusok, feloldási feltételek.

### **Minigame**
Minigame logika, típustól függő játékmenet.

### **Tárgyak** (Item)
Egy tárgy definíciója: stackable, rarity, effect, stb.

### **Inventory**
Játékos inventoryja, tárgy Management.

### **Játék** (GameManager)
Szálkezelés: dialógusok, minigamek, inventory, trait módosítások összekapcsolása.

---

## 🚀 Fejlesztői Útmutató

### Szükséges technológiák
- **Egyszerű DOM manipuláció**
- **Vanilla JavaScript** (ES6+)
- **JSON** adattároláshoz
- **Web Audio API** vagy **Howler.js** zenelejátszáshoz

---

## 📝 Dialógus Szerkesztés

Új dialógus hozzáadásához:

```javascript
// data/dialogs.js
const dialogs = [
  // ... meglévő dialógusok
  {
    id: 10,
    speaker: "új NPC",
    text: "Ez egy új dialógus!",
    choices: [
      {
        text: "Első válasz",
        nextDialog: 11,
        traitModifier: { empathy: +2 }
      },
      {
        text: "Második válasz",
        nextDialog: 12,
        traitModifier: { aggression: +3, empathy: -2 }
      }
    ]
  }
  // ... stb.
];
```

---

## 🎨 Esztétika

- **Visual Novel UI**: Félátlátszó panelek, cyberpunk neon színek (rózsaszín, kék, lila)
- **Font**: Monospace (pl. *Courier New*, *IBM Plex Mono*) a hacker érzéshez
- **Háttérkép**: Pixelart, glitch effektek, "mátrix" szerű animációk

---

## 📋 Jövőbeli Kiterjesztések

- [ ] Mentés/Betöltés rendszer
- [ ] Több ág sztori (branching narrative)
- [ ] NPC kapcsolat rendszer
- [ ] Végkifejlet variáció (5+ lehetséges vég)
- [ ] Cheater mód (trait hack)

---

## 👥 Projekt Csapata

| Csapattag | Szerep | Feladatok |
|-----------|--------|----------|
| **Szuda Tibor Szilveszter** | Kreatív vezető | Dialógus írás, kódolás, kreatív irányítás |
| **Vén Dávid Zsolt** | Hangmérnök | Zene, hangeffektek, hangmérnökség, kódolás |
| **Szontagh Ágoston Botond** | Rendszer tervezó | Rendszer architektúra, kódolás, technikai tervezés |

---



