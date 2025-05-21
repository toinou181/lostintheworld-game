/**
 * Player - Player entity in the game
 */
class Player extends Entity {
    constructor(x, y, name, characterClass, appearance) {
        super(x, y, 30, 50);
        this.name = name || 'Player';
        this.characterClass = characterClass || 'warrior';
        this.appearance = appearance || 'type-a';
        this.speed = 200;  // Movement speed in pixels per second
        this.lastPosition = { x, y }; // Last position (for collision resolution)
        this.isLocalPlayer = false;
        this.id = null; // Player ID for networking
        
        // Colors for different character classes
        this.classColors = {
            warrior: '#FF5722',
            mage: '#2196F3',
            ranger: '#4CAF50',
            rogue: '#9C27B0'
        };
    }
    
    /**
     * Update player state
     */
    update(deltaTime) {
        if (!this.isLocalPlayer) return;
        
        // Store last position for collision resolution
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        
        const engine = window.game.engine;
        const input = engine.input;
        
        // Reset velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        // Handle movement input
        if (input.isKeyPressed('KeyW') || input.isKeyPressed('ArrowUp')) {
            this.velocity.y = -this.speed;
        }
        if (input.isKeyPressed('KeyS') || input.isKeyPressed('ArrowDown')) {
            this.velocity.y = this.speed;
        }
        if (input.isKeyPressed('KeyA') || input.isKeyPressed('ArrowLeft')) {
            this.velocity.x = -this.speed;
        }
        if (input.isKeyPressed('KeyD') || input.isKeyPressed('ArrowRight')) {
            this.velocity.x = this.speed;
        }
        
        // Apply diagonal movement normalization
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            const factor = 1 / Math.sqrt(2);
            this.velocity.x *= factor;
            this.velocity.y *= factor;
        }
        
        // Apply velocity
        super.update(deltaTime);
        
        // Check for collisions with world objects
        const world = window.game.world;
        if (!world.isValidPosition(this.x, this.y, this.width, this.height)) {
            // Revert to last position if collision occurs
            this.x = this.lastPosition.x;
            this.y = this.lastPosition.y;
        }
        
        // Send position update to server if we've moved
        if (this.x !== this.lastPosition.x || this.y !== this.lastPosition.y) {
            if (engine.network && engine.network.connected) {
                engine.network.send('player_move', {
                    x: this.x,
                    y: this.y
                });
            }
        }
    }
    
    /**
     * Render player
     */
    render(ctx) {
        // Get screen coordinates
        const world = window.game.world;
        const screenPos = world.worldToScreen(this.x, this.y);
        
        // Draw player character
        const color = this.classColors[this.characterClass] || '#FF5722';
        
        // Draw body
        ctx.fillStyle = color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        
        // Draw head
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.arc(screenPos.x + this.width / 2, screenPos.y - 5, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw name above player
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenPos.x + this.width / 2, screenPos.y - 20);
    }
}