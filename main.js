import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';

const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};

const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container);

// Export for use in other modules if needed
export { dialogSystem, dialogPanel };