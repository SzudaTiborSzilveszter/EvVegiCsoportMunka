export default class Karakter {
    constructor(name, health, strength, dialogSystem, imageSrc) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.strength = strength;
        this.dialogSystem = dialogSystem;
        this.imageSrc = imageSrc; // Itt adjuk át az 1.jpg-t
        this.elementId = `char-${this.name.toLowerCase().replace(/\s/g, '-')}`;
    }

    render(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const htmlTemplate = `
            <div id="${this.elementId}" class="character-wrapper" style="cursor: pointer; text-align: center; margin: 20px;">
                <img src="${this.imageSrc}" alt="${this.name}" class="character-img" style="width: 200px; transition: transform 0.2s;">
                <div class="char-label" style="background: rgba(0,0,0,0.7); color: white; padding: 5px; border-radius: 5px; margin-top: 5px;">
                    ${this.name} (Click to Talk)
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', htmlTemplate);

        // Eseménykezelő a kattintáshoz
        const element = document.getElementById(this.elementId);
        // Karakter.js-ben a render metóduson belül:
        element.addEventListener('click', () => {
            // Itt a talk-nak átadjuk a DialogPanel példányt
            // Ehhez a talk hívásnál a test.js-ben lévő dialogPanel-t kell használnunk
            this.talk(window.dialogPanel); 
        });

        // Kis vizuális visszacsatolás (hover effekt)
        element.addEventListener('mouseenter', () => {
            element.querySelector('img').style.transform = 'scale(1.05)';
        });
        element.addEventListener('mouseleave', () => {
            element.querySelector('img').style.transform = 'scale(1)';
        });
        
    }

    talk(uiPanel) {
        if (uiPanel) {
            console.log(`Interacting with ${this.name}...`);
            // Itt nem a dialogSystem-et, hanem a DialogPanel-t hívjuk meg!
            uiPanel.startDialog('mainCharacter', 0); 
        }
    }
}