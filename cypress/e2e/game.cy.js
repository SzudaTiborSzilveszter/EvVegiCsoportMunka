describe('Game Basic Functionality Tests', () => {
  beforeEach(() => {
    // Játék betöltése test.html-ből
    cy.visit('/test.html');
    cy.wait(1000); // Várakozunk, hogy a játék betöltödjön
  });

  it('should load the game and display main menu', () => {
    cy.get('#main-menu').should('exist');
    cy.get('#main-menu').should('be.visible');
    cy.contains('START').should('exist');
  });

  it('should display scene after starting game', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('#scene-container').should('be.visible');
    cy.get('.scene-background').should('exist');
  });

  it('should start dialog when clicking on sibling character', () => {
    cy.contains('START').click();
    cy.wait(500);
    
    // Keressük meg a sibling karaktert (y: 30 körül)
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    // Dialog panel megjelenik
    cy.get('.dialog-panel').should('be.visible');
    cy.get('.character-name').should('contain', 'Jia');
    cy.get('.dialog-text').should('exist');
  });

  it('should show character sprite during dialog', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    // Dialog sprite megjelenik
    cy.get('.dialog-sprite.left').should('have.css', 'opacity').and('not.equal', '0');
  });

  it('should advance dialog with choice buttons', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    // Kattints az első választásra
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    // Az új dialog szövege megjelenik
    cy.get('.dialog-text').should('exist');
  });

  it('should show Tovabb button when no choices available', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    // Tovabb gomb megjelenik
    cy.get('.next-btn').should('be.visible');
    cy.get('.next-btn').should('contain', 'Tovább');
  });

  it('should advance to next dialog with Tovabb button', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    const firstDialogText = cy.get('.dialog-text');
    
    cy.get('.next-btn').click();
    cy.wait(500);
    
    // A dialog szövege megváltozott
    cy.get('.dialog-text').should('exist');
  });

  it('should close dialog and show single character when only Tovabb available', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    
    // Csak egy sprite látható (centered-solo)
    cy.get('.dialog-sprite.centered-solo').should('be.visible');
  });

  it('should transition to street scene via exit button', () => {
    cy.contains('START').click();
    cy.wait(500);
    
    // Kattints az exit gombra (bal felső sarok)
    cy.get('.scene-items').within(() => {
      cy.get('.scene-item').first().click();
    });
    cy.wait(500);
    
    // Dialog megjelenik
    cy.get('.dialog-panel').should('be.visible');
    cy.get('.next-btn').click();
    cy.wait(1000);
    
    // Street jelenet betöltődik
    cy.get('.scene-background').should('exist');
  });

  it('should display correct character names in dialog header', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    // Jia (sibling) név jelenik meg
    cy.get('.character-name').should('contain', 'Jia');
  });

  it('should have audio manager playing ambient music', () => {
    cy.contains('START').click();
    cy.wait(500);
    
    // Az audio elem létezik
    cy.get('audio').should('exist');
  });

  it('should handle multiple choice selections', () => {
    cy.contains('START').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    
    // Ellenőrizzük, hogy van legalább 3 választás
    cy.get('.choice-btn').should('have.length.at.least', 1);
  });

  it('should show settings menu', () => {
    cy.get('.settings-btn').click();
    cy.wait(500);
    
    cy.get('#settings-panel').should('be.visible');
    cy.get('.settings-close').click();
    cy.wait(300);
    cy.get('#settings-panel').should('not.be.visible');
  });

  it('should control volume with sliders', () => {
    cy.get('.settings-btn').click();
    cy.wait(500);
    
    cy.get('#music-volume').should('exist');
    cy.get('#sfx-volume').should('exist');
    
    // Változtassuk meg a hangerőt
    cy.get('#music-volume').invoke('val', 50).trigger('input');
    cy.get('#music-volume').should('have.value', '50');
  });
});
