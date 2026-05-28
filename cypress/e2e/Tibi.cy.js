describe('Tibi Tesztjei', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/public/index.html');
    cy.wait(1000); 
  });
  
  it('Játék betöltése és főmenü megjelenítése', () => {
    cy.get('#main-menu').should('exist');
    cy.get('#main-menu').should('be.visible');
    cy.contains('PLAY').should('exist');
  });

  it('Jelenet megjelenítése PLAY gomb után', () => {
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

  it('Karakter megjelenítése dialóg alatt', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.dialog-sprite').should('be.visible');
  });

  it('Dialog léptetése választás gombokkal', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().should('exist');
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
  });

  it('Beállítások menü megjelenítése és bezárása', () => {
    cy.get('#settings-btn').should('exist');
    cy.get('#settings-btn').click();
    cy.wait(500);
    cy.get('.settings-menu-content').should('be.visible');
    cy.get('#close-settings-btn').should('exist').click();
    cy.wait(300);
    cy.get('.menu-title h1').should('exist');
  });

  it('Hangerő csúszka vezérlése', () => {
    cy.get('#settings-btn').click();
    cy.wait(500);
    cy.get('#volume-slider').should('exist');
    cy.get('#volume-slider').invoke('val', 75).trigger('input');
    cy.get('#volume-slider').should('have.value', '75');
  });

  it('Mute toggle működése', () => {
    cy.get('#settings-btn').click();
    cy.wait(500);
    cy.get('#mute-toggle').should('exist');
    cy.get('#mute-toggle').click();
    cy.wait(300);
    cy.get('#mute-toggle').should('be.checked');
  });

  it('Jelenetváltás exit gombbal', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-item').first().click();
    cy.wait(500);
    cy.get('.dialog-panel').should('exist');
    cy.get('.next-btn').click();
    cy.wait(1000);
    cy.get('.scene-background').should('exist');
  });

  it('Háttérzene lejátszása', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('audio#bg-music').should('exist');
  });

  it('Jelenet háttérképe betöltődik', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-background').should('exist');
    cy.get('.scene-background').should('have.css', 'background-image');
  });

  it('Karakter elhelyezése a jelenetben', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').should('exist');
    cy.get('.scene-character').first().should('have.css', 'left');
    cy.get('.scene-character').first().should('have.css', 'top');
  });

  it('Dialógus overlay megjelenítése', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.dialog-overlay').should('exist');
  });

  it('Dialog bezárása az utolsó Tovább gomb után', () => {
    cy.contains('PLAY').click();
    cy.wait(500);
    cy.get('.scene-character').first().click();
    cy.wait(500);
    cy.get('.choice-btn').first().click();
    cy.wait(500);
    cy.get('.next-btn').click();
    cy.wait(500);
    cy.get('#scene-container').should('be.visible');
  });
});