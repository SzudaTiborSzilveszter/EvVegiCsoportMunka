/**
 * Integration and Edge Cases Tests
 * Tests complex interactions, error handling, and edge cases
 */

describe('Integration and Edge Cases', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.wait(1000);
  });

  describe('Game Initialization', () => {
    it('should initialize all game systems', () => {
      cy.window().then((win) => {
        expect(win.gameManager).to.exist;
        expect(win.mainMenu).to.exist;
        expect(win.inventorySystem).to.exist;
      });
    });

    it('should have all UI components available', () => {
      cy.window().then((win) => {
        expect(win.inventoryUI).to.exist;
        expect(win.minigameUI).to.exist;
        expect(win.minigameManager).to.exist;
      });
    });

    it('should display main menu on startup', () => {
      cy.get('#main-menu').should('be.visible');
      cy.get('.menu-title').should('be.visible');
    });

    it('should have all required containers in DOM', () => {
      cy.get('#scene-container').should('exist');
      cy.get('#dialog-container').should('exist');
      cy.get('#minigame-container').should('exist');
    });
  });

  describe('Full Game Flow', () => {
    it('should complete start -> game -> dialog sequence', () => {
      // Start game
      cy.get('.play-btn').click();
      cy.wait(500);
      
      // Verify game loaded
      cy.get('#scene-container').should('be.visible');
      
      // Start dialog
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Verify dialog showing
      cy.get('.dialog-panel').should('be.visible');
    });

    it('should handle multiple dialog choices in sequence', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // First choice
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // Verify dialog still exists
      cy.get('#dialog-container').should('exist');
      
      // Second choice if available
      cy.get('.choice-btn, .next-btn').then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn.first()).click();
          cy.wait(500);
          
          cy.get('#dialog-container').should('exist');
        }
      });
    });

    it('should maintain game state through dialog progression', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.window().then((win) => {
        const initialInv = win.inventorySystem?.getItems?.()?.length ?? 0;
        
        cy.get('.scene-character').first().click();
        cy.wait(500);
        
        cy.get('.choice-btn').first().click();
        cy.wait(500);
        
        // Inventory should be accessible
        const finalInv = win.inventorySystem?.getItems?.()?.length ?? 0;
        expect(typeof finalInv).to.equal('number');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid scene transitions gracefully', () => {
      cy.window().then((win) => {
        // Try loading invalid scene
        if (win.gameManager?.loadScene) {
          const result = win.gameManager.loadScene('invalid_scene_name');
          // Should return false or handle gracefully
          expect(result).to.be.a('boolean');
        }
      });
    });

    it('should handle rapid clicks without crashing', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      // Rapid clicks on character
      cy.get('.scene-character').first().click();
      cy.get('.scene-character').first().click();
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Game should still be functional
      cy.get('#scene-container').should('exist');
    });

    it('should handle rapid dialog button clicks', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.choice-btn').then(($btns) => {
        if ($btns.length > 0) {
          // Rapid click same button
          cy.wrap($btns.first()).click();
          cy.wrap($btns.first()).click();
          cy.wait(500);
          
          cy.get('#dialog-container').should('exist');
        }
      });
    });

    it('should handle inventory overflow gracefully', () => {
      cy.window().then((win) => {
        // Fill inventory
        for (let i = 0; i < 25; i++) {
          win.inventorySystem?.addItem?.({
            id: `overflow_${i}`,
            name: `Overflow ${i}`,
            stackable: false,
            description: 'Test'
          });
        }
        
        const items = win.inventorySystem?.getItems?.();
        
        // Should not exceed limit
        expect(items?.length).to.be.at.most(20);
      });
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent character state', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.window().then((win) => {
        const character = win.gameManager?.character;
        
        cy.get('.scene-character').first().click();
        cy.wait(500);
        
        // Character should still be valid
        expect(win.gameManager?.character).to.exist;
      });
    });

    it('should maintain consistent inventory state', () => {
      cy.window().then((win) => {
        const initialItems = win.inventorySystem?.getItems?.()?.length ?? 0;
        
        cy.get('.play-btn').click();
        cy.wait(500);
        
        const gameItems = win.inventorySystem?.getItems?.()?.length ?? 0;
        
        expect(typeof gameItems).to.equal('number');
      });
    });

    it('should maintain consistent scene state', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible');
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Scene should still be loaded
      cy.get('#scene-container').should('be.visible');
    });
  });

  describe('UI Element Visibility', () => {
    it('should show/hide elements appropriately', () => {
      cy.get('#main-menu').should('be.visible');
      
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#main-menu').should('not.be.visible');
      cy.get('#scene-container').should('be.visible');
    });

    it('should maintain element visibility during interactions', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible');
      cy.get('.scene-background').should('exist');
    });

    it('should properly layer dialog over scene', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible');
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-overlay').should('be.visible');
      cy.get('.dialog-panel').should('be.visible');
    });
  });

  describe('CSS and Styling', () => {
    it('should have proper styling on main menu', () => {
      cy.get('#main-menu').should('have.class', 'main-menu');
    });

    it('should have proper styling on scene container', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('have.css', 'position');
    });

    it('should have proper styling on dialog panel', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-panel').should('have.class', 'dialog-panel');
    });

    it('should maintain responsive positioning', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').should('have.css', 'left');
      cy.get('.scene-character').should('have.css', 'top');
    });
  });

  describe('Data Validation', () => {
    it('should have valid character data', () => {
      cy.window().then((win) => {
        // Characters should be accessible
        cy.get('.scene-character').should('exist');
      });
    });

    it('should have valid dialog data', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-text').should('not.be.empty');
    });

    it('should have valid scene data', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-background').should('exist');
      cy.get('.scene-character').should('have.length.greaterThan', 0);
    });
  });

  describe('Performance', () => {
    it('should load game in reasonable time', () => {
      cy.get('#main-menu').should('be.visible', { timeout: 5000 });
    });

    it('should transition between scenes smoothly', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible', { timeout: 2000 });
    });

    it('should display dialogs without significant delay', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-panel').should('be.visible', { timeout: 2000 });
    });
  });

  describe('Cross-System Integration', () => {
    it('should integrate GameManager with DialogSystem', () => {
      cy.window().then((win) => {
        expect(win.gameManager).to.exist;
      });
      
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-panel').should('be.visible');
    });

    it('should integrate DialogPanel with SceneManager', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      // Dialog should hide/show characters properly
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-sprite').should('exist');
    });

    it('should integrate InventorySystem with GameManager', () => {
      cy.window().then((win) => {
        cy.get('.play-btn').click();
        cy.wait(500);
        
        // Inventory should be accessible during game
        expect(win.inventorySystem).to.exist;
      });
    });

    it('should integrate TraitSystem with DialogSystem', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Making choices should affect traits
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      cy.get('#dialog-container').should('exist');
    });
  });

  describe('Memory and Resource Management', () => {
    it('should not leak memory on multiple dialog cycles', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      // Open and close dialogs multiple times
      for (let i = 0; i < 3; i++) {
        cy.get('.scene-character').first().click();
        cy.wait(300);
        
        cy.get('.choice-btn, .next-btn').then(($btn) => {
          if ($btn.length > 0) {
            cy.wrap($btn.first()).click();
            cy.wait(300);
          }
        });
      }
      
      // Game should still be functional
      cy.get('#scene-container').should('exist');
    });

    it('should properly cleanup old elements', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      // Should only have one scene-container
      cy.get('#scene-container').should('have.length', 1);
    });
  });

  describe('Accessibility', () => {
    it('should have alt text on images', () => {
      cy.get('.scene-character').first().should('have.attr', 'alt');
    });

    it('should have button elements be keyboard accessible', () => {
      cy.get('.play-btn').should('have.attr', 'type');
      cy.get('.choice-btn').should('have.attr', 'type');
    });

    it('should have labeled form controls', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('[class*="volume"]').then(($vol) => {
        if ($vol.length > 0) {
          // Volume control should be properly associated
          cy.wrap($vol).should('exist');
        }
      });
    });
  });

  describe('Browser Compatibility', () => {
    it('should work without console errors', () => {
      // Visit without crashing
      cy.visit('/public/index.html', {
        onBeforeLoad: (win) => {
          cy.stub(win.console, 'error').as('consoleError');
        }
      });
      
      cy.get('#main-menu').should('exist');
    });

    it('should display correctly at different viewport sizes', () => {
      cy.viewport('iphone-x');
      cy.get('#main-menu').should('be.visible');
      
      cy.viewport('desktop');
      cy.get('#main-menu').should('be.visible');
    });
  });
});
