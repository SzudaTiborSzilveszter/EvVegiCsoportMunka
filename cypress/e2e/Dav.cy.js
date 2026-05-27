describe('Dávid tesztjei', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.wait(1000); 
  });
  it('Dialog léptetése választás gombokkal', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    cy.get('#dialog-container').should('be.visible');
  });

  it('Tovább gomb megjelenítése, amikor nincs választás', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    cy.get('.next-btn').should('exist');
    cy.get('.next-btn').should('contain', 'Tovább');
  });

  it('Egyetlen karakter középen amikor csak Tovább gomb van', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    cy.get('.dialog-sprite').should('exist');
  });

  it('Jelenetváltás exit gombbal a street-re', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    
    cy.get('.scene-item').first().click();
    cy.wait(500);
    
    cy.get('.dialog-panel').should('exist');
    cy.get('.next-btn').click();
    cy.wait(1000);
    
    cy.get('.scene-background').should('exist');
  });

});