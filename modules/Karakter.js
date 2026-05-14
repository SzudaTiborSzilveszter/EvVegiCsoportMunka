// JAVÍTOTT SOR: Mivel egy mappában vannak
import TraitSystem from './TraitSystem.js'; 
// JAVÍTOTT SOR: A data mappa a modules mellett van, így innen nézve ../data/
import { characterTraits } from '../data/traits.js';

export default class Karakter {
    constructor(name, health, strength, dialogSystem, imageSrc) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.strength = strength;
        this.dialogSystem = dialogSystem;
        this.imageSrc = imageSrc;
        
        const traitKey = this.name.toLowerCase().replace(/\s/g, '-');
        this.elementId = `char-${traitKey}`;

        const initialTraits = characterTraits[traitKey] || characterTraits["maincharacter"];
        this.traitSystem = new TraitSystem(initialTraits);
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

        const element = document.getElementById(this.elementId);
        
        // Biztosítjuk, hogy a kattintás esemény regisztrálva legyen
        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.talk(window.dialogPanel); 
        });

        element.addEventListener('mouseenter', () => {
            const img = element.querySelector('img');
            if(img) img.style.transform = 'scale(1.05)';
        });
        element.addEventListener('mouseleave', () => {
            const img = element.querySelector('img');
            if(img) img.style.transform = 'scale(1)';
        });
    }

    talk(uiPanel) {
        const panel = uiPanel || window.dialogPanel;
        if (panel) {
            console.log(`Interacting with ${this.name}...`);
            // Itt a panelen keresztül indítjuk a dialógust
            panel.startDialog('mainCharacter', 0); 
        } else {
            console.warn("DialogPanel not found! Make sure window.dialogPanel is set.");
        }
    }

    modifyTraits(modifier) {
        this.traitSystem.modifyTraits(modifier);
    }
}