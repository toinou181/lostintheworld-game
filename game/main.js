/**
 * Main Game - Central coordinator for the game
 */
class Game {
    constructor() {
        console.log('Initializing Lost in the World game...');
        
        // Get canvas and context
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas to full screen
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game entities
        this.entities = [];
        
        // Set up systems
        this.world = new World(this);
        this.characterSystem = new CharacterSystem(this);
        this.menuSystem = new MenuSystem(this);
        
        // Player reference
        this.player = null;
        
        // Other players (for multiplayer)
        this.otherPlayers = [];
        
        // Game state
        this.running = false;
        this.isMultiplayer = false;
        this.lastTime = 0;
        
        // Set up event listeners for keyboard input
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Escape' && this.running) {
                this.togglePause();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Make game accessible globally
        window.game = this;
        
        // Initialize the game
        this.init();
        
        // Remove loading screen with a small delay
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.display = 'none';
            
            // Show main menu
            this.menuSystem.showMainMenu();
        }, 1000);
    }
    
    /**
     * Resize canvas to fit window
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    /**
     * Initialize the game
     */
    init() {
        console.log('Game initialization complete');
    }
    
    /**
     * Add entity to the game
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Remove entity from the game
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }
    
    /**
     * Start a single-player game
     */
    startGame(player) {
        console.log('Starting new game...');
        
        // Set up player
        this.player = player;
        this.player.isLocalPlayer = true;
        this.addEntity(this.player);
        
        // Reset other variables
        this.running = true;
        this.isMultiplayer = false;
        this.otherPlayers = [];
        
        // Show game canvas
        this.menuSystem.showGameCanvas();
        
        // Start game loop if not already running
        if (!this.animationFrameId) {
            this.lastTime = performance.now();
            this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
        
        console.log('Game started successfully');
    }
    
    /**
     * Start a multiplayer game
     */
    startMultiplayerGame(player, isHost) {
        console.log('Starting multiplayer game...');
        
        // Set up player
        this.player = player;
        this.player.isLocalPlayer = true;
        this.addEntity(this.player);
        
        // Reset other variables
        this.running = true;
        this.isMultiplayer = true;
        this.otherPlayers = [];
        
        // Show game canvas
        this.menuSystem.showGameCanvas();
        
        // Start game loop if not already running
        if (!this.animationFrameId) {
            this.lastTime = performance.now();
            this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
        
        // Set up simulated networking
        this.setupNetworkSimulation();
        
        console.log('Multiplayer game started successfully');
    }
    
    /**
     * Set up simulated network functionality for multiplayer
     */
    setupNetworkSimulation() {
        console.log('Setting up simulated network connection...');
        
        // Simulate network connection
        setTimeout(() => {
            console.log('Connected to simulated multiplayer server');
            this.showMessage('Connected to multiplayer server!');
            
            // Simulate other players joining
            this.simulatePlayerJoin();
        }, 1500);
    }
    
    /**
     * Simulate other players joining the game
     */
    simulatePlayerJoin() {
        // Create 2-3 simulated players
        const classes = ['warrior', 'mage', 'ranger', 'rogue'];
        const appearances = ['type-a', 'type-b', 'type-c'];
        const names = ['Player1', 'Player2', 'Player3'];
        
        const playerCount = 2 + Math.floor(Math.random());
        
        for (let i = 0; i < playerCount; i++) {
            // Random position near the player
            const x = this.player.x + (Math.random() - 0.5) * 500;
            const y = this.player.y + (Math.random() - 0.5) * 500;
            
            // Create player with random attributes
            const characterClass = classes[Math.floor(Math.random() * classes.length)];
            const appearance = appearances[Math.floor(Math.random() * appearances.length)];
            
            const otherPlayer = new Player(
                x, y,
                names[i],
                characterClass,
                appearance
            );
            otherPlayer.id = 'sim-player-' + i;
            
            // Add to game
            this.addEntity(otherPlayer);
            this.otherPlayers.push(otherPlayer);
            
            console.log(`Simulated player joined: ${otherPlayer.name}`);
        }
    }
    
    /**
     * Toggle game pause
     */
    togglePause() {
        if (this.running) {
            this.running = false;
            this.menuSystem.showMenu('pause-menu');
        } else {
            this.running = true;
            this.menuSystem.hideAllMenus();
        }
    }
    
    /**
     * Show a message on screen
     */
    showMessage(text) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = text;
        
        // Add to DOM
        document.body.appendChild(messageElement);
        
        // Remove after delay
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        }, 3000);
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Schedule next frame
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        if (!this.running) return;
        
        // Update world
        this.world.update(deltaTime);
        
        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime, this);
            }
        }
        
        // Simulate other player movement in multiplayer
        if (this.isMultiplayer && this.running) {
            this.simulateOtherPlayerMovement(deltaTime);
        }
    }
    
    /**
     * Simulate other players moving around
     */
    simulateOtherPlayerMovement(deltaTime) {
        for (const player of this.otherPlayers) {
            // Random movement pattern
            if (Math.random() < 0.02) {
                player.simulatedMoveDirX = (Math.random() - 0.5) * 2;
                player.simulatedMoveDirY = (Math.random() - 0.5) * 2;
            }
            
            // Apply movement
            if (player.simulatedMoveDirX || player.simulatedMoveDirY) {
                const speed = 100; // pixels per second
                player.x += player.simulatedMoveDirX * speed * deltaTime;
                player.y += player.simulatedMoveDirY * speed * deltaTime;
            }
        }
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render world
        this.world.render(this.ctx);
        
        // Render all entities
        for (const entity of this.entities) {
            if (entity.render) {
                entity.render(this.ctx);
            }
        }
    }
    
    /**
     * Check if a key is pressed
     */
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}

// Start the game when the page is loaded
window.addEventListener('load', () => {
    new Game();
});