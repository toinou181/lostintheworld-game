/**
 * World - Manages the game world and its rendering
 */
class World {
    constructor(engine) {
        this.engine = engine;
        this.tileSize = 64;
        this.viewportWidth = this.engine.canvas.width;
        this.viewportHeight = this.engine.canvas.height;
        
        // Camera position (center of viewport in world coordinates)
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Create a basic grass texture
        this.grassPattern = this.createGrassPattern();
        
        // World objects (trees, rocks, etc.)
        this.objects = [];
        
        // Generate some random objects
        this.generateObjects();
        
        console.log('World initialized');
    }
    
    /**
     * Create a grass pattern for the ground
     */
    createGrassPattern() {
        // Create a small canvas for the grass pattern
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = 128;
        patternCanvas.height = 128;
        const patternContext = patternCanvas.getContext('2d');
        
        // Draw base green
        patternContext.fillStyle = '#4CAF50';
        patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
        
        // Draw some darker green spots
        patternContext.fillStyle = '#388E3C';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * patternCanvas.width;
            const y = Math.random() * patternCanvas.height;
            const size = 5 + Math.random() * 15;
            patternContext.beginPath();
            patternContext.arc(x, y, size, 0, Math.PI * 2);
            patternContext.fill();
        }
        
        // Draw some lighter green spots
        patternContext.fillStyle = '#66BB6A';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * patternCanvas.width;
            const y = Math.random() * patternCanvas.height;
            const size = 3 + Math.random() * 10;
            patternContext.beginPath();
            patternContext.arc(x, y, size, 0, Math.PI * 2);
            patternContext.fill();
        }
        
        // Create the pattern
        return this.engine.ctx.createPattern(patternCanvas, 'repeat');
    }
    
    /**
     * Generate random objects in the world
     */
    generateObjects() {
        // Generate some trees and rocks in a wider area around the starting point
        for (let i = 0; i < 50; i++) {
            // Random position in a 2000x2000 area centered at origin
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            
            // Random type (tree or rock)
            const type = Math.random() < 0.7 ? 'tree' : 'rock';
            
            this.objects.push({
                type,
                x,
                y,
                width: type === 'tree' ? 40 : 20,
                height: type === 'tree' ? 60 : 20
            });
        }
    }
    
    /**
     * Update world state
     */
    update(deltaTime) {
        // Update camera position if following player
        if (window.game && window.game.player) {
            this.cameraX = window.game.player.x;
            this.cameraY = window.game.player.y;
        }
    }
    
    /**
     * Render the world
     */
    render(ctx) {
        // Calculate the visible area in world coordinates
        const left = this.cameraX - this.viewportWidth / 2;
        const top = this.cameraY - this.viewportHeight / 2;
        const right = this.cameraX + this.viewportWidth / 2;
        const bottom = this.cameraY + this.viewportHeight / 2;
        
        // Draw the grass ground
        ctx.fillStyle = this.grassPattern;
        ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);
        
        // Draw world objects
        for (const obj of this.objects) {
            // Skip objects outside the visible area
            if (obj.x + obj.width < left || obj.x > right ||
                obj.y + obj.height < top || obj.y > bottom) {
                continue;
            }
            
            // Convert world coordinates to screen coordinates
            const screenX = (obj.x - left);
            const screenY = (obj.y - top);
            
            // Draw the object
            if (obj.type === 'tree') {
                this.drawTree(ctx, screenX, screenY);
            } else if (obj.type === 'rock') {
                this.drawRock(ctx, screenX, screenY);
            }
        }
    }
    
    /**
     * Draw a tree at the specified position
     */
    drawTree(ctx, x, y) {
        // Draw trunk
        ctx.fillStyle = '#795548';
        ctx.fillRect(x + 15, y + 30, 10, 30);
        
        // Draw foliage
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(x + 20, y + 20, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Draw a rock at the specified position
     */
    drawRock(ctx, x, y) {
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.ellipse(x + 10, y + 10, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        const left = this.cameraX - this.viewportWidth / 2;
        const top = this.cameraY - this.viewportHeight / 2;
        
        return {
            x: left + screenX,
            y: top + screenY
        };
    }
    
    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        const left = this.cameraX - this.viewportWidth / 2;
        const top = this.cameraY - this.viewportHeight / 2;
        
        return {
            x: worldX - left,
            y: worldY - top
        };
    }
    
    /**
     * Check if a position is valid (not colliding with objects)
     */
    isValidPosition(x, y, width, height) {
        // Check collision with world objects
        for (const obj of this.objects) {
            if (x < obj.x + obj.width &&
                x + width > obj.x &&
                y < obj.y + obj.height &&
                y + height > obj.y) {
                return false;
            }
        }
        
        return true;
    }
}