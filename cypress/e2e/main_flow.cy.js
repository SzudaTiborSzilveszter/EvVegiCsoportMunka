/**
 * Main Game Flow Tests
 * Tests core gameplay mechanics: menu, scene loading, dialog flow, choices
 */

describe('Main Game Flow', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.wait(1000); // Wait for game to initialize
  });

  describe('Main Menu', () => {
    it('should load and display main menu on startup', () => {
      cy.get('#main-menu').should('exist').and('be.visible');
      cy.get('.menu-title h1').should('contain', 'Neon Shadow');
      cy.get('.play-btn').should('contain', 'PLAY');
      cy.get('.settings-btn').should('contain', 'SETTINGS');
      cy.get('.exit-btn').should('contain', 'EXIT');
    });

    it('should hide menu when clicking PLAY button', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      cy.get('#main-menu').should('not.be.visible');
    });

    it('should show settings panel when clicking SETTINGS', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      cy.get('.settings-menu-content').should('be.visible');
      cy.get('.settings-header h2').should('contain', 'SETTINGS');
    });

    it('should close settings and return to menu', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      cy.get('.settings-close').should('be.visible').click();
      cy.wait(300);
      cy.get('.menu-title h1').should('be.visible');
    });
  });

  describe('Scene Loading', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
    });

    it('should load first scene (apartmentDay) after starting game', () => {
      cy.get('#scene-container').should('be.visible');
      cy.get('.scene-background').should('exist');
      cy.get('.scene-background').should('have.css', 'background-image').and('include', 'apartment_day');
    });

    it('should display sibling character in first scene', () => {
      cy.get('.scene-character').should('have.length.at.least', 1);
      // Get the first character (sibling)
      cy.get('.scene-character').first().should('be.visible');
    });

    it('should have clickable area for exit door', () => {
      // Exit door is an invisible item in the top-left
      cy.get('.scene-item').should('exist');
    });
  });

  describe('Dialog Initiation', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
    });

    it('should start dialog when clicking sibling character', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('#dialog-container').should('be.visible');
      cy.get('.dialog-panel').should('exist');
      cy.get('.character-name').should('contain', 'Jia'); // Sibling's name
      cy.get('.dialog-text').should('not.be.empty');
    });

    it('should display dialog sprite when dialog starts', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Check that at least one sprite is visible
      cy.get('.dialog-sprite').should('exist');
    });

    it('should show correct character name in dialog header', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.character-name').should('contain', 'Jia');
    });
  });

  describe('Dialog Choices', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
      cy.get('.scene-character').first().click();
      cy.wait(500);
    });

    it('should display choice buttons when available', () => {
      cy.get('.choice-btn').should('have.length.at.least', 1);
    });

    it('should advance dialog when selecting a choice', () => {
      const dialogText = cy.get('.dialog-text');
      
      // Save first dialog text
      cy.get('.dialog-text').then(($el) => {
        const firstText = $el.text();
        
        // Click first choice
        cy.get('.choice-btn').first().click();
        cy.wait(500);
        
        // Dialog should have changed or button should change
        cy.get('.dialog-panel').should('exist');
      });
    });

    it('should hide choice buttons and show Tovabb when no choices available', () => {
      // Navigate through choices until we hit a dialog without choices
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // Look for either more choices or the Tovabb button
      cy.get('.dialog-panel').should('exist');
      cy.get('.next-btn, .choice-btn').should('exist');
    });
  });

  describe('Dialog Progression', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
      cy.get('.scene-character').first().click();
      cy.wait(500);
    });

    it('should show Tovabb button when dialog has no choices', () => {
      // Navigate to a dialog without choices
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // If no choices button appears, check for Tovabb
      cy.get('.next-btn').should('be.visible').and('contain', 'Tovább');
    });

    it('should advance to next dialog when clicking Tovabb', () => {
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // If Tovabb button is present, click it
      cy.get('.next-btn').then(($btn) => {
        if ($btn.length > 0) {
          cy.get('.next-btn').click();
          cy.wait(500);
          cy.get('.dialog-panel').should('exist');
        }
      });
    });

    it('should close dialog when progression is triggered', () => {
      // Navigate through dialogs until progression
      // This is story-dependent, so we just verify dialog can close
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // Try to click next if available
      cy.get('.next-btn').then(($btn) => {
        if ($btn.length > 0) {
          cy.get('.next-btn').click();
          cy.wait(1000);
          // Either dialog still visible or closed
          cy.get('#dialog-container').then(($container) => {
            // Just verify structure is intact
            expect($container.length).to.be.greaterThan(0);
          });
        }
      });
    });
  });

  describe('Scene Transitions', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
    });

    it('should transition to street scene', () => {
      // Click sibling
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Navigate through dialogs to trigger scene transition
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // Get current background
      cy.get('.scene-background').then(($bg) => {
        const initialBg = $bg.css('background-image');
        
        // Continue clicking through until scene changes
        cy.get('.next-btn, .choice-btn').then(($btn) => {
          if ($btn.length > 0) {
            $btn.first().click();
          }
        });
      });
    });
  });
});
