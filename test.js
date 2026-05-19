import GameManager from './modules/GameManager.js';
import SceneManager from './modules/SceneManager.js';
import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import AudioManager from './modules/AudioManager.js';
import { scenes } from './data/scenes.js';
import { characters } from './data/characters.js';

const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};

const audioManager = new AudioManager();
const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container);
const sceneManager = new SceneManager(document.getElementById('scene-container'), characters, audioManager);

// Initialize GameManager - the main orchestrator
const gameManager = new GameManager(sceneManager, dialogSystem, dialogPanel, audioManager, scenes);

// Start the game with the first scene
gameManager.startGame('apartmentDay');

// Expose for debugging
window.gameManager = gameManager;
console.log('Game started! Open console and check gameManager.getStoryState() to see progression.');