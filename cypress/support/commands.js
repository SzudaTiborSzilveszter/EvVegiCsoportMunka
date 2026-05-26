// Support fájl Cypress-hez
// Itt lehet hozzáadni custom parancsokat és beállításokat

Cypress.Commands.add('startGame', () => {
  cy.visit('/test.html');
  cy.wait(1000);
  cy.contains('START').click();
  cy.wait(500);
});

Cypress.Commands.add('clickCharacter', (characterIndex = 0) => {
  cy.get('.scene-character').eq(characterIndex).click();
  cy.wait(500);
});

Cypress.Commands.add('selectChoice', (choiceIndex = 0) => {
  cy.get('.choice-btn').eq(choiceIndex).click();
  cy.wait(500);
});

Cypress.Commands.add('clickTovabb', () => {
  cy.get('.next-btn').click();
  cy.wait(500);
});

Cypress.Commands.add('isDialogVisible', () => {
  cy.get('.dialog-panel').should('be.visible');
});

Cypress.Commands.add('closeDialog', () => {
  // Kattints az overlay-re a dialog bezárásához
  cy.get('.dialog-overlay.visible').click({ force: true });
  cy.wait(300);
});
