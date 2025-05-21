/**
 * Player - Player entity in the game
 */
class Player {
    constructor(x, y, name, characterClass, appearance) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.name = name || 'Player';
        this.characterClass = characterClass || 'warrior';
        this.appearance = appearance || 'type-a';
        this.speed = 200;  // Movement speed in pixels per second
        this.lastPosition = { x, y }; // Last position (for collision resolution)
        this.isLocalPlayer = false;
        this.id = null; // Player ID for networking
        this.velocity = { x: 0, y: 0 }; // Current velocity
        
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
    update(deltaTime, game) {
        if (!this.isLocalPlayer) return;
        
        // Store last position for collision resolution
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        
        // Reset velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        // Handle movement input
        if (game.isKeyPressed('KeyW') || game.isKeyPressed('ArrowUp')) {
            this.velocity.y = -this.speed;
        }
        if (game.isKeyPressed('KeyS') || game.isKeyPressed('ArrowDown')) {
            this.velocity.y = this.speed;
        }
        if (game.isKeyPressed('KeyA') || game.isKeyPressed('ArrowLeft')) {
            this.velocity.x = -this.speed;
        }
        if (game.isKeyPressed('KeyD') || game.isKeyPressed('ArrowRight')) {
            this.velocity.x = this.speed;
        }
        
        // Apply diagonal movement normalization
        if (this.velocity.x !== 0 && this.velocity.y !== 0) {
            const factor = 1 / Math.sqrt(2);
            this.velocity.x *= factor;
            this.velocity.y *= factor;
        }
        
        // Apply velocity
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Check for collisions with world objects
        const world = window.game.world;
        if (!world.isValidPosition(this.x, this.y, this.width, this.height)) {
            // Revert to last position if collision occurs
            this.x = this.lastPosition.x;
            this.y = this.lastPosition.y;
        }
        
        // Handle multiplayer position updates if needed
        if (game.isMultiplayer && this.isLocalPlayer) {
            // We'd normally send updates to the server here, but we're keeping it simple for now
            // In a real implementation, this would trigger network updates
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