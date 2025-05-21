/**
 * Main Game - Central coordinator for the game
 */
class Game {
    constructor() {
        console.log('Initializing Lost in the World game...');
        
        // Initialize the engine
        this.engine = new TonioEngine('game-canvas');
        
        // Set up systems
        this.world = new World(this.engine);
        this.characterSystem = new CharacterSystem(this);
        this.menuSystem = new MenuSystem(this);
        
        // Player reference
        this.player = null;
        
        // Other players (for multiplayer)
        this.otherPlayers = [];
        
        // Game state
        this.running = false;
        this.isMultiplayer = false;
        
        // Initialize the engine and set callbacks
        this.engine.onInit = () => this.init();
        this.engine.onUpdate = (deltaTime) => this.update(deltaTime);
        this.engine.onRender = (ctx) => this.render(ctx);
        
        // Set up event listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.running) {
                this.togglePause();
            }
        });
        
        // Make game accessible globally
        window.game = this;
        
        // Start the engine
        this.engine.init();
        
        // Remove loading screen with a small delay
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.display = 'none';
            
            // Show main menu
            this.menuSystem.showMainMenu();
        }, 1000);
    }
    
    /**
     * Initialize the game
     */
    init() {
        console.log('Game initialization complete');
    }
    
    /**
     * Start a single-player game
     */
    startGame(player) {
        console.log('Starting new game...');
        
        // Set up player
        this.player = player;
        this.player.isLocalPlayer = true;
        this.engine.addEntity(this.player);
        
        // Reset other variables
        this.running = true;
        this.isMultiplayer = false;
        this.otherPlayers = [];
        
        // Show game canvas
        this.menuSystem.showGameCanvas();
        
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
        this.engine.addEntity(this.player);
        
        // Reset other variables
        this.running = true;
        this.isMultiplayer = true;
        this.otherPlayers = [];
        
        // Show game canvas
        this.menuSystem.showGameCanvas();
        
        // Set up networking
        if (this.engine.network) {
            // Connect to a (simulated) server
            const serverUrl = 'wss://game-server.example.com';
            this.engine.network.connect(serverUrl);
            
            // Set up network event handlers
            this.setupNetworkHandlers();
            
            // Join the game once connected
            this.engine.network.on('connect', () => {
                this.engine.network.send('join_game', {
                    x: this.player.x,
                    y: this.player.y,
                    name: this.player.name,
                    character: {
                        class: this.player.characterClass,
                        appearance: this.player.appearance
                    }
                });
            });
        }
        
        console.log('Multiplayer game started successfully');
    }
    
    /**
     * Set up network event handlers for multiplayer
     */
    setupNetworkHandlers() {
        const network = this.engine.network;
        
        // Handle player join events
        network.on('player_join', (data) => {
            console.log(`Player joined: ${data.name} (${data.id})`);
            
            // Create a new player entity
            const otherPlayer = new Player(
                data.x, data.y,
                data.name,
                data.character ? data.character.class : 'warrior',
                data.character ? data.character.appearance : 'type-a'
            );
            otherPlayer.id = data.id;
            
            // Add to the game
            this.engine.addEntity(otherPlayer);
            this.otherPlayers.push(otherPlayer);
            
            // Add to network player list
            network.addPlayer(data.id, data);
        });
        
        // Handle player leave events
        network.on('player_leave', (data) => {
            console.log(`Player left: ${data.id}`);
            
            // Find and remove the player
            const playerIndex = this.otherPlayers.findIndex(p => p.id === data.id);
            if (playerIndex !== -1) {
                const player = this.otherPlayers[playerIndex];
                this.engine.removeEntity(player);
                this.otherPlayers.splice(playerIndex, 1);
            }
            
            // Remove from network player list
            network.removePlayer(data.id);
        });
        
        // Handle player movement events
        network.on('player_move', (data) => {
            if (data.playerId === network.clientId) {
                // This is us, ignore
                return;
            }
            
            // Find the player
            const player = this.otherPlayers.find(p => p.id === data.playerId);
            if (player) {
                // Update position
                player.x = data.x;
                player.y = data.y;
            }
        });
        
        // Handle join success event
        network.on('join_success', (data) => {
            console.log('Successfully joined game:', data);
            
            // Update player ID
            this.player.id = data.playerId;
            
            // Show a welcome message
            this.engine.ui.showMessage('Connected to multiplayer server!');
        });
    }
    
    /**
     * Toggle game pause
     */
    togglePause() {
        if (this.running) {
            this.running = false;
            this.menuSystem.ui.showMenu('pause-menu');
        } else {
            this.running = true;
            this.menuSystem.ui.hideAllMenus();
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        if (!this.running) return;
        
        // Update world
        this.world.update(deltaTime);
        
        // Player input and movement are handled in Player class
    }
    
    /**
     * Render the game
     */
    render(ctx) {
        // World rendering handled in World class
        // Entity rendering handled by the engine
    }
}

// Start the game when the page is loaded
window.addEventListener('load', () => {
    new Game();
});