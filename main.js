import DialogSystem from './modules/DialogSystem.js';
import DialogPanel from './ui/DialogPanel.js';
import { AudioManager } from './modules/AudioManager.js';   
import { InventorySystem } from './modules/InventorySystem.js';

const mockCharacterData = {
    modifyTraits(modifier) {
        console.log('Traits modified:', modifier);
    }
};
const inventory = new InventorySystem(20);
const audioManager = new AudioManager()
const dialogSystem = new DialogSystem(mockCharacterData);
const container = document.getElementById('dialog-container');
const dialogPanel = new DialogPanel(dialogSystem, container);

inventory.addItem({
    id: 'cyber_deck_01',
    name: 'Huncut kis kés',
    stackable: false,
    description: 'Egy régi, de működőképes hackelő eszköz.'
});
// Export for use in other modules if needed
export { dialogSystem, dialogPanel };