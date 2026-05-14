import DialogSystem from "../modules/DialogSystem.js";
import DialogPanel from "../ui/DialogPanel.js"

const dialogSystem = new DialogSystem(characterData);
const dialogPanel = new DialogPanel(dialogSystem, containerElement);