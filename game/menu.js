/**
 * Menu - Manages game menus
 */
class MenuSystem {
    constructor(game) {
        this.game = game;
        this.menus = {};
        this.activeMenu = null;
        
        // Create menu container
        this.menuContainer = document.getElementById('menu-container');
        
        // Create menus
        this.createMainMenu();
        this.createPauseMenu();
        this.createOptionsMenu();
        this.createMultiplayerMenu();
        
        console.log('Menu system initialized');
    }
    
    /**
     * Create a menu with title and options
     */
    createMenu(id, title, options) {
        // Create menu element
        const menu = document.createElement('div');
        menu.className = 'menu';
        menu.id = id;
        menu.style.display = 'none';
        
        // Create title
        const titleElement = document.createElement('h1');
        titleElement.textContent = title;
        menu.appendChild(titleElement);
        
        // Create buttons
        for (const option of options) {
            const button = document.createElement('button');
            button.className = 'menu-button';
            button.textContent = option.text;
            button.addEventListener('click', option.action);
            menu.appendChild(button);
        }
        
        // Add to menu container
        this.menuContainer.appendChild(menu);
        
        // Store reference
        this.menus[id] = menu;
        
        return menu;
    }
    
    /**
     * Show a specific menu
     */
    showMenu(menuId) {
        this.hideAllMenus();
        const menu = this.menus[menuId];
        if (menu) {
            menu.style.display = 'block';
            this.activeMenu = menuId;
        }
    }
    
    /**
     * Hide all menus
     */
    hideAllMenus() {
        for (const menuId in this.menus) {
            this.menus[menuId].style.display = 'none';
        }
        this.activeMenu = null;
    }
    
    /**
     * Create main menu
     */
    createMainMenu() {
        this.createMenu('main-menu', 'Lost in the World', [
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
                action: () => this.showMenu('multiplayer-menu') 
            },
            { 
                text: 'Options', 
                action: () => this.showMenu('options-menu') 
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
        this.createMenu('pause-menu', 'Game Paused', [
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
                action: () => this.showMenu('options-menu') 
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
        const optionsMenu = this.createMenu('options-menu', 'Options', [
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
                action: () => this.showMenu('main-menu') 
            }
        ]);
    }
    
    /**
     * Create multiplayer menu
     */
    createMultiplayerMenu() {
        this.createMenu('multiplayer-menu', 'Multiplayer', [
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
                action: () => this.showMenu('main-menu') 
            }
        ]);
    }
    
    /**
     * Show main menu
     */
    showMainMenu() {
        this.hideGameCanvas();
        this.showMenu('main-menu');
    }
    
    /**
     * Start a new game
     */
    startNewGame() {
        this.hideAllMenus();
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
            this.hideAllMenus();
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
        this.hideAllMenus();
        this.showGameCanvas();
        this.game.running = true;
    }
    
    /**
     * Quit to main menu
     */
    quitToMainMenu() {
        this.game.running = false;
        this.hideAllMenus();
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
        alert('Lost in the World\n\nDeveloped by Tonio');
    }
    
    /**
     * Join a multiplayer game
     */
    joinMultiplayerGame() {
        this.hideAllMenus();
        this.game.characterSystem.showCharacterCreation((player) => {
            this.game.startMultiplayerGame(player, false);
        });
    }
    
    /**
     * Host a multiplayer game
     */
    hostMultiplayerGame() {
        this.hideAllMenus();
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