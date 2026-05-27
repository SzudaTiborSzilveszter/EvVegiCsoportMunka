describe('Agoston tesztjei', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.wait(1000); 
  });
  it('Helyes karakterneveket megjeleníteni a dialógus fejlécben', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    cy.get('.character-name').should('exist');
  });

  it('Hangkezelő lejátszik ambient zenét', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    
    cy.get('audio#bg-music').should('exist');
  });

  it('Több választási lehetőség kezelése', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    cy.get('.choice-btn').should('exist');
  });

  it('Beállítások menü megjelenítése', () => {
    cy.get('#settings-btn').click();
    cy.wait(500);
    
    cy.get('.settings-menu-content').should('be.visible');
    cy.get('#close-settings-btn').click();
    cy.wait(300);
    cy.get('.menu-title h1').should('exist');
  });

  it('Hangerő csúszka vezérlése', () => {
    cy.get('#settings-btn').click();
    cy.wait(500);
    
    cy.get('#volume-slider').should('exist');
    
    cy.get('#volume-slider').invoke('val', 50).trigger('input');
    cy.get('#volume-slider').should('have.value', '50');
  });
});
