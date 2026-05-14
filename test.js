import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import MinigameManager from './modules/MinigameManager.js';
import MinigameUI from './ui/MinigameUI.js';
import { minigames } from './data/minigames.js';
import { InventorySystem } from './modules/InventorySystem.js';
import InventoryUI from './ui/InventoryUI.js';

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

// Initialize minigame system
const minigameContainer = document.getElementById('minigame-container');
const minigameUI = new MinigameUI(minigameContainer);
const minigameManager = new MinigameManager(dialogSystem, minigameUI, minigames);

// Test button event listeners - Dialog
const startMainBtn = document.getElementById('start-main-dialog');
const startSiblingBtn = document.getElementById('start-sibling-dialog');
const endDialogBtn = document.getElementById('end-dialog');

// Test button event listeners - Minigames
const startLockpickingBtn = document.getElementById('start-lockpicking');
const startHackingBtn = document.getElementById('start-hacking');
const startPuzzleBtn = document.getElementById('start-puzzle');

inventory.addItem({
    id: 'test_chip',
    name: 'Adat-chip',
    stackable: false,
    description: 'Titkosított vállalati adatokkal.'
});

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
