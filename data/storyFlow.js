/**
 * FULL STORY PROGRESSION PIPELINE
 * 
 * Flow:
 * 1. Game starts with apartmentDay scene
 * 2. Player clicks Sibling character
 * 3. Dialog 0 plays: "Már megint?"
 * 4. Player chooses response (affects traits)
 * 5. Dialog continues to Dialog 1
 * 6. Dialog 1 ends with progression rules:
 *    - Sets flag: "askedAboutDoctor"
 *    - Transitions to: apartmentNight scene
 * 7. ApartmentNight loads with new character positions
 * 8. New dialogs available
 * ... and so on
 */

const storyFlow = `
┌─────────────────────────────────────────────────────────────┐
│ SCENE: apartmentDay                                         │
│ Characters: sibling (clickable), mainCharacter              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ (click sibling)
┌─────────────────────────────────────────────────────────────┐
│ DIALOG: sibling[0]                                          │
│ "Már megint?"                                               │
│ 3 choices → all lead to sibling[1]                          │
│ progression: { setFlag: "askedAboutDoctor" }                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ (Tovább button)
┌─────────────────────────────────────────────────────────────┐
│ DIALOG: sibling[1]                                          │
│ "Muszáj mihamarabb találnunk egy dokit..."                  │
│ 3 choices + progression → nextScene: "apartmentNight"       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ (GameManager catches dialog end)
┌─────────────────────────────────────────────────────────────┐
│ SCENE TRANSITION                                            │
│ - setFlag("askedAboutDoctor") = true                        │
│ - loadScene("apartmentNight")                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ SCENE: apartmentNight                                       │
│ Different background, same characters in new positions      │
│ NEW dialogs available                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓ (continue or skip)
                     [More scenes...]
`;

export const progressionPipeline = storyFlow;
