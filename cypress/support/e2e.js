import './commands.js';

// Globális Cypress beállítások
beforeEach(() => {
  cy.on('uncaught:exception', (err, runnable) => {
    // Figyelmen kívül hagyjuk az amúgy nem kritikus hibákat
    return false;
  });
});
