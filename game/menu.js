/**
 * Menu - Manages game menus
 */
class MenuSystem {
    constructor(game) {
        this.game = game;
        this.ui = game.engine.ui;
        
        // Create menus
        this.createMainMenu();
        this.createPauseMenu();
        this.createOptionsMenu();
        this.createMultiplayerMenu();
        
        console.log('Menu system initialized');
    }
    
    /**
     * Create main menu
     */
    createMainMenu() {
        this.ui.createMenu('main-menu', 'Lost in the World', [
            { 
                text: 'New Game', 
                action: () => this.startNewGame() 
            },
            { 
                text: 'Continue', 
                action: () => this.continueGame() 
            },
            { 
                text: 'Multiplayer', 
                action: () => this.ui.showMenu('multiplayer-menu') 
            },
            { 
                text: 'Options', 
                action: () => this.ui.showMenu('options-menu') 
            },
            { 
                text: 'Credits',
                action: () => this.showCredits()
            }
        ]);
    }
    
    /**
     * Create pause menu
     */
    createPauseMenu() {
        this.ui.createMenu('pause-menu', 'Game Paused', [
            { 
                text: 'Resume', 
                action: () => this.resumeGame() 
            },
            { 
                text: 'Save Game', 
                action: () => this.saveGame() 
            },
            { 
                text: 'Options', 
                action: () => this.ui.showMenu('options-menu') 
            },
            { 
                text: 'Quit to Main Menu', 
                action: () => this.quitToMainMenu() 
            }
        ]);
    }
    
    /**
     * Create options menu
     */
    createOptionsMenu() {
        const optionsMenu = this.ui.createMenu('options-menu', 'Options', [
            { 
                text: 'Sound: On', 
                action: (e) => this.toggleSound(e.target) 
            },
            { 
                text: 'Music: On', 
                action: (e) => this.toggleMusic(e.target) 
            },
            { 
                text: 'Controls', 
                action: () => this.showControls() 
            },
            { 
                text: 'Back', 
                action: () => this.ui.showMenu('main-menu') 
            }
        ]);
    }
    
    /**
     * Create multiplayer menu
     */
    createMultiplayerMenu() {
        this.ui.createMenu('multiplayer-menu', 'Multiplayer', [
            { 
                text: 'Join Game', 
                action: () => this.joinMultiplayerGame() 
            },
            { 
                text: 'Host Game', 
                action: () => this.hostMultiplayerGame() 
            },
            { 
                text: 'Back', 
                action: () => this.ui.showMenu('main-menu') 
            }
        ]);
    }
    
    /**
     * Show main menu
     */
    showMainMenu() {
        this.hideGameCanvas();
        this.ui.showMenu('main-menu');
    }
    
    /**
     * Start a new game
     */
    startNewGame() {
        this.ui.hideAllMenus();
        this.game.characterSystem.showCharacterCreation((player) => {
            this.game.startGame(player);
        });
    }
    
    /**
     * Continue a saved game
     */
    continueGame() {
        const player = this.game.characterSystem.loadCharacter();
        if (player) {
            this.ui.hideAllMenus();
            this.game.startGame(player);
        } else {
            alert('No saved game found!');
        }
    }
    
    /**
     * Save the current game
     */
    saveGame() {
        if (this.game.player) {
            const success = this.game.characterSystem.saveCharacter(this.game.player);
            if (success) {
                alert('Game saved successfully!');
            } else {
                alert('Failed to save game!');
            }
        }
    }
    
    /**
     * Resume the game from pause
     */
    resumeGame() {
        this.ui.hideAllMenus();
        this.showGameCanvas();
        this.game.running = true;
    }
    
    /**
     * Quit to main menu
     */
    quitToMainMenu() {
        this.game.running = false;
        this.ui.hideAllMenus();
        this.showMainMenu();
    }
    
    /**
     * Toggle sound setting
     */
    toggleSound(button) {
        const isSoundOn = button.textContent.includes('On');
        button.textContent = isSoundOn ? 'Sound: Off' : 'Sound: On';
        // In a real game, would toggle sound here
    }
    
    /**
     * Toggle music setting
     */
    toggleMusic(button) {
        const isMusicOn = button.textContent.includes('On');
        button.textContent = isMusicOn ? 'Music: Off' : 'Music: On';
        // In a real game, would toggle music here
    }
    
    /**
     * Show controls screen
     */
    showControls() {
        alert('Controls:\n\nWASD or Arrow Keys - Movement\nEsc - Pause Game');
    }
    
    /**
     * Show credits
     */
    showCredits() {
        alert('Lost in the World\n\nCreated with TonioEngine\nDeveloped by Tonio');
    }
    
    /**
     * Join a multiplayer game
     */
    joinMultiplayerGame() {
        this.ui.hideAllMenus();
        this.game.characterSystem.showCharacterCreation((player) => {
            this.game.startMultiplayerGame(player, false);
        });
    }
    
    /**
     * Host a multiplayer game
     */
    hostMultiplayerGame() {
        this.ui.hideAllMenus();
        this.game.characterSystem.showCharacterCreation((player) => {
            this.game.startMultiplayerGame(player, true);
        });
    }
    
    /**
     * Show game canvas
     */
    showGameCanvas() {
        document.getElementById('game-canvas').style.display = 'block';
    }
    
    /**
     * Hide game canvas
     */
    hideGameCanvas() {
        document.getElementById('game-canvas').style.display = 'none';
    }
}