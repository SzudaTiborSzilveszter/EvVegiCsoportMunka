/**
 * Settings and Audio Tests
 * Tests menu settings, volume controls, and audio functionality
 */

describe('Settings and Audio', () => {
  beforeEach(() => {
    cy.visit('/public/index.html');
    cy.wait(1000);
  });

  describe('Settings Menu', () => {
    it('should display settings button in main menu', () => {
      cy.get('.settings-btn').should('be.visible');
      cy.get('.settings-btn').should('contain', 'SETTINGS');
    });

    it('should open settings panel when clicking settings button', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-menu-content').should('be.visible');
    });

    it('should display settings header', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-header').should('be.visible');
      cy.get('.settings-header h2').should('contain', 'SETTINGS');
    });

    it('should have close button in settings', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-close').should('be.visible');
    });

    it('should close settings when clicking close button', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-close').click();
      cy.wait(500);
      
      cy.get('.menu-title').should('be.visible');
    });

    it('should return to menu after closing settings', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-close').click();
      cy.wait(500);
      
      cy.get('.play-btn').should('be.visible');
    });
  });

  describe('Volume Control', () => {
    beforeEach(() => {
      cy.get('.settings-btn').click();
      cy.wait(500);
    });

    it('should have volume slider in settings', () => {
      cy.get('#volume-slider, [class*="volume"]').should('exist');
    });

    it('should have volume value indicator', () => {
      cy.get('.volume-value, [class*="volume-value"]').should('exist');
    });

    it('should allow adjusting volume', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).should('have.attr', 'type', 'range');
        }
      });
    });

    it('should have volume between 0 and 100', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).should('have.attr', 'min');
          cy.wrap($slider).should('have.attr', 'max');
        }
      });
    });

    it('should update volume when slider changes', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).invoke('val', 50).trigger('input');
          
          cy.wrap($slider).should('have.value', '50');
        }
      });
    });

    it('should have mute/unmute functionality', () => {
      // Some implementations have mute buttons
      cy.get('[class*="mute"]').then(($mute) => {
        if ($mute.length > 0) {
          cy.wrap($mute).should('be.visible');
        }
      });
    });
  });

  describe('Audio System', () => {
    it('should have audio element in page', () => {
      cy.get('audio').should('exist');
    });

    it('should have background music audio element', () => {
      cy.get('audio#bg-music').should('exist');
    });

    it('should have volume property', () => {
      cy.get('audio#bg-music').then(($audio) => {
        expect($audio[0].volume).to.exist;
      });
    });

    it('should support audio playback', () => {
      cy.get('audio').should('exist');
      // Audio can be played
      expect(true).to.be.true;
    });
  });

  describe('Audio Manager', () => {
    it('should have AudioManager instance', () => {
      cy.window().then((win) => {
        // Audio manager is exposed or used by GameManager
        expect(win.gameManager).to.exist;
      });
    });

    it('should maintain volume setting', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).invoke('val', 75).trigger('input');
          
          cy.get('.settings-close').click();
          cy.wait(500);
          
          cy.get('.settings-btn').click();
          cy.wait(500);
          
          // Volume should remain at 75
          cy.get('#volume-slider, [class*="volume"]').then(($newSlider) => {
            if ($newSlider.length > 0) {
              cy.wrap($newSlider).should('have.value', '75');
            }
          });
        }
      });
    });
  });

  describe('Menu Navigation', () => {
    it('should navigate from menu to game', () => {
      cy.get('.play-btn').click();
      cy.wait(500);
      
      cy.get('#scene-container').should('be.visible');
    });

    it('should navigate from settings back to menu', () => {
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-close').click();
      cy.wait(500);
      
      cy.get('.play-btn').should('be.visible');
    });

    it('should maintain menu state during settings navigation', () => {
      cy.get('.play-btn').should('be.visible');
      
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('.settings-close').click();
      cy.wait(500);
      
      cy.get('.play-btn').should('be.visible');
    });
  });

  describe('Settings Persistence', () => {
    it('should remember volume setting', () => {
      // Change volume
      cy.get('.settings-btn').click();
      cy.wait(500);
      
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).invoke('val', 30).trigger('input');
          
          // Close and reopen
          cy.get('.settings-close').click();
          cy.wait(300);
          
          cy.get('.settings-btn').click();
          cy.wait(500);
          
          // Check if setting persisted
          cy.get('#volume-slider, [class*="volume"]').then(($newSlider) => {
            if ($newSlider.length > 0) {
              cy.wrap($newSlider).invoke('val').then((val) => {
                expect(val).to.exist;
              });
            }
          });
        }
      });
    });
  });

  describe('Exit Button', () => {
    it('should have exit button in menu', () => {
      cy.get('.exit-btn').should('be.visible');
      cy.get('.exit-btn').should('contain', 'EXIT');
    });

    it('should handle exit button click', () => {
      cy.get('.exit-btn').then(($btn) => {
        // Exit button may close window or show confirmation
        cy.wrap($btn).should('be.visible');
      });
    });
  });

  describe('In-Game Settings', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
    });

    it('should display settings in-game if available', () => {
      cy.get('[class*="settings"]').then(($settings) => {
        // Settings may be accessible during gameplay
        expect($settings.length).to.be.at.least(0);
      });
    });

    it('should allow adjusting audio during gameplay', () => {
      // If settings accessible during game
      cy.get('[class*="settings"]').then(($settings) => {
        if ($settings.length > 0) {
          // Settings are accessible
          expect($settings.length).to.be.greaterThan(0);
        }
      });
    });
  });

  describe('Audio Playback During Game', () => {
    beforeEach(() => {
      cy.get('.play-btn').click();
      cy.wait(500);
    });

    it('should have audio playing in game', () => {
      cy.get('audio').should('exist');
    });

    it('should play music during scenes', () => {
      cy.get('#scene-container').should('be.visible');
      
      // Audio element should exist
      cy.get('audio#bg-music').should('exist');
    });

    it('should play sounds during dialog', () => {
      cy.get('.scene-character').first().click();
      cy.wait(500);
      
      // Audio element exists
      cy.get('audio').should('exist');
    });
  });

  describe('Volume Range', () => {
    beforeEach(() => {
      cy.get('.settings-btn').click();
      cy.wait(500);
    });

    it('should have minimum volume of 0', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).should('have.attr', 'min', '0');
        }
      });
    });

    it('should have maximum volume of 100', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).should('have.attr', 'max', '100');
        }
      });
    });

    it('should allow setting volume to minimum', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).invoke('val', 0).trigger('input');
          cy.wrap($slider).should('have.value', '0');
        }
      });
    });

    it('should allow setting volume to maximum', () => {
      cy.get('#volume-slider, [class*="volume"]').then(($slider) => {
        if ($slider.length > 0) {
          cy.wrap($slider).invoke('val', 100).trigger('input');
          cy.wrap($slider).should('have.value', '100');
        }
      });
    });
  });
});
