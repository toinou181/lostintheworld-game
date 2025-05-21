/**
 * TonioEngine - A custom game engine
 * Core component handling game initialization, loop, and rendering
 */
class TonioEngine {
    constructor(canvasId) {
        console.log('Initializing TonioEngine...');
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.entities = [];
        this.running = false;
        this.lastTime = 0;
        this.onInit = null;
        this.onUpdate = null;
        this.onRender = null;

        // Set canvas to full screen
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Engine subsystems
        this.input = null;  // Will be initialized later
        this.ui = null;     // Will be initialized later
        this.network = null; // Will be initialized later
        
        console.log('TonioEngine initialized');
    }

    /**
     * Resize canvas to fit window
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Initialize engine subsystems
     */
    init() {
        console.log('Setting up TonioEngine subsystems...');
        if (typeof TonioInput !== 'undefined') {
            this.input = new TonioInput(this);
        }
        if (typeof TonioUI !== 'undefined') {
            this.ui = new TonioUI(this);
        }
        if (typeof TonioNetwork !== 'undefined') {
            this.network = new TonioNetwork(this);
        }

        if (this.onInit) {
            this.onInit();
        }
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.running) return;
        console.log('Starting TonioEngine game loop');
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**
     * Stop the game loop
     */
    stop() {
        console.log('Stopping TonioEngine game loop');
        this.running = false;
    }

    /**
     * Add entity to the engine
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Remove entity from the engine
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        if (!this.running) return;

        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Schedule next frame
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**
     * Update all entities
     */
    update(deltaTime) {
        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime);
            }
        }

        // Call custom update callback
        if (this.onUpdate) {
            this.onUpdate(deltaTime);
        }
    }

    /**
     * Render all entities
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all entities
        for (const entity of this.entities) {
            if (entity.render) {
                entity.render(this.ctx);
            }
        }

        // Call custom render callback
        if (this.onRender) {
            this.onRender(this.ctx);
        }
    }
}