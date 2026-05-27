describe('Tibi Tesztjei', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.wait(1000); 
  });
  /*Tibi része*/
  it('Játék betöltése és főmenü megjelenítése', () => {
    cy.get('#main-menu').should('exist');
    cy.get('#main-menu').should('be.visible');
    cy.contains('PLAY').should('exist');
  });

  it('Jelenet megjelenítése START gomb után', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('#scene-container').should('be.visible');
    cy.get('.scene-background').should('exist');
  });

  it('Dialog indítása karakter kattintásra', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    cy.get('.dialog-panel').should('be.visible');
    cy.get('.character-name').should('exist');
    cy.get('.dialog-text').should('exist');
  });

  it('Karakter sprite megjelenítése dialóg alatt', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    cy.get('.dialog-sprite').should('be.visible');
  });
});