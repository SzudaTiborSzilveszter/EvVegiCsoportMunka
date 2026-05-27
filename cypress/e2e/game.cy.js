describe('Game Basic Functionality Tests', () => {
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
  /**/
  /*Dávid része*/
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
  /**/
  /*Ágoston része*/
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
  /**/
});
