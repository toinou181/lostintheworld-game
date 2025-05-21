/**
 * Entity - Base class for all game entities in TonioEngine
 */
class Entity {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
        this.active = true;
    }
    
    /**
     * Update entity state
     */
    update(deltaTime) {
        // Base update - apply velocity
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }
    
    /**
     * Render entity
     */
    render(ctx) {
        // Default rendering - draw a rectangle
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    /**
     * Check collision with another entity
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}

/**
 * Sprite - An entity with an image
 */
class Sprite extends Entity {
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height);
        this.image = new Image();
        this.image.src = imageSrc;
        this.loaded = false;
        
        this.image.onload = () => {
            this.loaded = true;
        };
    }
    
    render(ctx) {
        if (this.loaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Draw placeholder until image loads
            super.render(ctx);
        }
    }
}

/**
 * AnimatedSprite - A sprite with animation frames
 */
class AnimatedSprite extends Sprite {
    constructor(x, y, width, height, frameSources) {
        super(x, y, width, height, frameSources[0]);
        this.frames = [];
        this.currentFrame = 0;
        this.frameTime = 0;
        this.frameDuration = 0.1; // Time per frame in seconds
        
        // Load all frames
        for (const src of frameSources) {
            const img = new Image();
            img.src = src;
            this.frames.push(img);
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Update animation
        this.frameTime += deltaTime;
        if (this.frameTime >= this.frameDuration) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.image = this.frames[this.currentFrame];
        }
    }
}