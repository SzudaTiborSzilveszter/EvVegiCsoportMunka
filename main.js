import GameManager from './modules/GameManager.js';
import SceneManager from './modules/SceneManager.js';
import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import AudioManager from './modules/AudioManager.js';
import MinigameManager from './modules/MinigameManager.js';
import MinigameUI from './ui/MinigameUI.js';
import MainMenu from './ui/MainMenu.js';
import InventoryUI from './ui/InventoryUI.js';
import { InventorySystem } from './modules/InventorySystem.js';
import { scenes } from './data/scenes.js';
import { characters } from './data/characters.js';
import { minigames } from './data/minigames.js';

const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};

const audioManager = new AudioManager();
const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container, audioManager);
const sceneManager = new SceneManager(document.getElementById('scene-container'), characters, audioManager);
const inventorySystem = new InventorySystem(20);
const minigameUI = new MinigameUI(document.getElementById('minigame-container'));
const minigameManager = new MinigameManager(dialogSystem, dialogPanel, minigameUI, minigames, audioManager);

// Initialize Inventory UI
const inventoryUI = new InventoryUI(inventorySystem);

// Set SceneManager reference in DialogPanel for character hiding/showing
dialogPanel.setSceneManager(sceneManager);

// Initialize GameManager - the main orchestrator
const gameManager = new GameManager(sceneManager, dialogSystem, dialogPanel, audioManager, scenes, inventorySystem, minigameManager);

// Initialize Main Menu
const mainMenu = new MainMenu(audioManager);
mainMenu.setGameManager(gameManager);

// Show main menu on startup
mainMenu.showMenu();

// Expose for debugging
window.gameManager = gameManager;
window.mainMenu = mainMenu;
window.inventorySystem = inventorySystem;
window.inventoryUI = inventoryUI;
window.minigameManager = minigameManager;
window.minigameUI = minigameUI;
console.log('Game initialized! Main menu is displayed.');