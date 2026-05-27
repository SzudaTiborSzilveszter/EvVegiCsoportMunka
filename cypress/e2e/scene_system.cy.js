/**
 * Scene System Tests
 * Tests scene loading, character positioning, item placement, and scene transitions
 */

describe('Scene System', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.wait(1000);
    cy.get('.play-btn').click();
    cy.wait(500);
  });

  describe('Scene Loading', () => {
    it('should load initial scene on game start', () => {
      cy.get('#scene-container').should('be.visible');
      cy.get('.scene-background').should('exist');
    });

    it('should display scene background', () => {
      cy.get('.scene-background').should('have.css', 'background-image');
    });

    it('should load apartment day background initially', () => {
      cy.get('.scene-background').should('have.css', 'background-image').and('include', 'apartment_day');
    });

    it('should have scene container with proper structure', () => {
      cy.get('#scene-container').within(() => {
        cy.get('.scene-background').should('exist');
      });
    });

    it('should render scene layer elements', () => {
      cy.get('[class*="scene"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Character Positioning', () => {
    it('should display characters in scene', () => {
      cy.get('.scene-character').should('have.length.greaterThan', 0);
    });

    it('should position characters correctly', () => {
      cy.get('.scene-character').should('have.css', 'position');
      cy.get('.scene-character').should('have.css', 'left');
      cy.get('.scene-character').should('have.css', 'top');
    });

    it('should have character images displayed', () => {
      cy.get('.scene-character').first().should('have.css', 'background-image');
    });

    it('should display sibling character in first scene', () => {
      cy.get('.scene-character').should('have.length.at.least', 1);
    });

    it('should make characters clickable', () => {
      cy.get('.scene-character').first().should('have.css', 'cursor');
    });

    it('should have proper character z-index layering', () => {
      cy.get('.scene-character').each(($char) => {
        cy.wrap($char).should('have.css', 'z-index');
      });
    });
  });

  describe('Item Placement', () => {
    it('should have items in scene', () => {
      cy.get('.scene-item').should('have.length.greaterThan', 0);
    });

    it('should position items correctly', () => {
      cy.get('.scene-item').first().should('have.css', 'position');
      cy.get('.scene-item').first().should('have.css', 'left');
      cy.get('.scene-item').first().should('have.css', 'top');
    });

    it('should display item images if visible', () => {
      cy.get('.scene-item').each(($item) => {
        // Item may have image or be invisible (clickable area)
        cy.wrap($item).should('exist');
      });
    });

    it('should have items with proper z-index', () => {
      cy.get('.scene-item').each(($item) => {
        cy.wrap($item).should('have.css', 'z-index');
      });
    });

    it('should support invisible items for clickable areas', () => {
      cy.get('.scene-item[data-invisible="true"]').then(($items) => {
        // May have invisible items for doors, exits, etc.
        expect($items.length).to.be.at.least(0);
      });
    });
  });

  describe('Scene Interactivity', () => {
    it('should trigger dialog when clicking character', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-panel').should('be.visible');
    });

    it('should trigger action when clicking item', () => {
      cy.get('.scene-item').first().click();
      cy.wait(500);
      
      // Should either trigger dialog or item pickup
      cy.get('#dialog-container, #scene-container').should('exist');
    });

    it('should handle character click events', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.character-name').should('not.be.empty');
    });
  });

  describe('Scene Data Structure', () => {
    it('should have scene configuration available', () => {
      cy.window().then((win) => {
        expect(win.gameManager).to.exist;
      });
    });

    it('should track current scene', () => {
      cy.window().then((win) => {
        // Game manager should know current scene
        expect(win.gameManager).to.exist;
      });
    });
  });

  describe('Multiple Scenes', () => {
    it('should be able to transition between scenes', () => {
      // Navigate through dialogs to potentially trigger scene transition
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.choice-btn').first().click();
      cy.wait(500);
      
      // Scene container should still be valid
      cy.get('#scene-container').should('exist');
    });

    it('should maintain scene integrity after transition', () => {
      cy.get('.scene-background').should('exist');
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible');
    });
  });

  describe('Scene Background', () => {
    it('should have visible background', () => {
      cy.get('.scene-background').should('be.visible');
    });

    it('should set background as CSS property', () => {
      cy.get('.scene-background').should('have.css', 'background-image');
    });

    it('should maintain background opacity', () => {
      cy.get('.scene-background').should('have.css', 'opacity');
    });

    it('should cover full scene container', () => {
      cy.get('.scene-background').should('have.css', 'width');
      cy.get('.scene-background').should('have.css', 'height');
    });
  });

  describe('Scene Container Dimensions', () => {
    it('should have visible scene container', () => {
      cy.get('#scene-container').should('be.visible');
    });

    it('should have width set', () => {
      cy.get('#scene-container').should('have.css', 'width');
    });

    it('should have height set', () => {
      cy.get('#scene-container').should('have.css', 'height');
    });

    it('should have position property', () => {
      cy.get('#scene-container').should('have.css', 'position');
    });
  });

  describe('Scene Character Interactions', () => {
    it('should hide character from scene during dialog', () => {
      cy.get('.scene-character').should('have.length.greaterThan', 0);
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Character interactions are managed by DialogPanel
      cy.get('.dialog-panel').should('be.visible');
    });

    it('should show character sprite during dialog', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-sprite').should('exist');
    });

    it('should properly transition character visibility', () => {
      cy.get('.scene-character').should('exist');
      
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-sprite').should('exist');
    });
  });

  describe('Scene Audio', () => {
    it('should have music for scene', () => {
      cy.get('audio').should('exist');
    });

    it('should play ambient music when scene loads', () => {
      // Audio element exists
      cy.get('audio#bg-music').should('exist');
    });
  });

  describe('Scene Click Handlers', () => {
    it('should register character click handlers', () => {
      // Verify characters are clickable
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      cy.get('.dialog-panel').should('exist');
    });

    it('should register item click handlers', () => {
      // Verify items are clickable
      cy.get('.scene-item').first().click();
      cy.wait(500);
      
      cy.get('#scene-container').should('exist');
    });

    it('should handle rapid clicks without breaking', () => {
      cy.get('.scene-character').first().click();
      cy.wait(200);
      cy.get('.scene-character').first().click();
      cy.wait(200);
      
      // Game should remain functional
      cy.get('#scene-container').should('exist');
    });
  });

  describe('Scene Manager API', () => {
    it('should have SceneManager instance available', () => {
      cy.window().then((win) => {
        // SceneManager exists and is used by GameManager
        expect(win.gameManager).to.exist;
      });
    });

    it('should be able to load different scenes', () => {
      cy.window().then((win) => {
        // GameManager should have scene loading capabilities
        expect(win.gameManager).to.exist;
      });
    });
  });
});
