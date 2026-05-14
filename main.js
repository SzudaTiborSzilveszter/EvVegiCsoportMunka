import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import { AudioManager } from './modules/AudioManager.js';   

const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};
const audioManager = new AudioManager()
const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container);

// Export for use in other modules if needed
export { dialogSystem, dialogPanel };