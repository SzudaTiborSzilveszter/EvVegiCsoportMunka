describe('Game Basic Functionality Tests', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.wait(1000);
  });
  it('Sikeresen betölti a főmenüt', () => {
   
    cy.contains('Neon Shadow').should('be.visible');
    cy.contains('PLAY').should('be.visible');
  });
});

it('kattintások', function() {;
  cy.visit('http://127.0.0.1:5500/public/index.html');
  cy.contains('PLAY').click();
    cy.wait(1000);
    cy.get('#char-0 img.character-sprite').click();
    cy.contains('Már megint?').should('be.visible');
  });

it('inventory megjelenése', function() {
  cy.visit('http://127.0.0.1:5500/public/index.html');
  cy.wait(1000);
  cy.contains('PLAY').click();
  cy.wait(1000);
  cy.get('#inventory-toggle').click();
  cy.contains('INVENTORY').click(); 
  cy.contains('INVENTORY').should('be.visible');
  cy.contains('Empty...').should('be.visible');
});

it('A hangerő állítható 50-ről 40-re', () => {
  cy.visit('http://127.0.0.1:5500/public/index.html');
  cy.wait(1000);  
    cy.contains('SETTINGS').click();
    cy.get('input[type="range"]')
    .invoke('val', 40)
    .trigger('input');
    cy.contains('40%').should('be.visible');
  });