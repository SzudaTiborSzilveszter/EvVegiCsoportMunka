import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import MinigameManager from './modules/MinigameManager.js';
import MinigameUI from './ui/MinigameUI.js';
import { minigames } from './data/minigames.js';
// 1. Karakter osztály importálása
import Karakter from '../modules/Karakter.js'; 
import { InventorySystem } from './modules/InventorySystem.js';
import InventoryUI from './ui/InventoryUI.js';
import AudioManager from './modules/AudioManager.js'


const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};
const inventory = new InventorySystem(20);
const inventoryUI = new InventoryUI(inventory);
const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container);
const audioManager = new AudioManager();

// --- 2. MS. BROWN LÉTREHOZÁSA ÉS MEGJELENÍTÉSE ---
// Az 1.jpg-t használjuk képként
const msBrown = new Karakter("Ms. Brown", 120, 15, dialogSystem, "/1.jpg");

// Létrehozunk egy helyet a karakternek a HTML-ben, ha még nincs
document.body.insertAdjacentHTML('beforeend', '<div id="character-area"></div>');
msBrown.render("#character-area");
// ------------------------------------------------

// Initialize minigame system
const minigameContainer = document.getElementById('minigame-container');
const minigameUI = new MinigameUI(minigameContainer);
const minigameManager = new MinigameManager(dialogSystem, dialogPanel, minigameUI, minigames, );

// Test button event listeners - Dialog
const startMainBtn = document.getElementById('start-main-dialog');
const startSiblingBtn = document.getElementById('start-sibling-dialog');
const endDialogBtn = document.getElementById('end-dialog');

// Test button event listeners - Minigames
const startLockpickingBtn = document.getElementById('start-lockpicking');
const startHackingBtn = document.getElementById('start-hacking');
const startPuzzleBtn = document.getElementById('start-puzzle');

window.dialogPanel = dialogPanel; // Elérhetővé tesszük a Karakter osztály számára

inventory.addItem('synth_caffeine');
inventory.addItem('broken_neural_link');


startMainBtn.addEventListener('click', () => {
    dialogPanel.startDialog('mainCharacter', 0);
    console.log('Started main character dialog');
});

startSiblingBtn.addEventListener('click', () => {
    dialogPanel.startDialog('sibling', 0);
    console.log('Started sibling dialog');
});

endDialogBtn.addEventListener('click', () => {
    dialogPanel.endDialog();
    console.log('Ended dialog');
});

startLockpickingBtn.addEventListener('click', () => {
    minigameManager.startGame('lockpicking_1');
    console.log('Started lockpicking minigame');
});

startHackingBtn.addEventListener('click', () => {
    minigameManager.startGame('hacking_1');
    console.log('Started hacking minigame');
});

startPuzzleBtn.addEventListener('click', () => {
    minigameManager.startGame('puzzle_1');
    console.log('Started puzzle minigame');
});