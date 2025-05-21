/**
 * TonioInput - Input handling system for TonioEngine
 */
class TonioInput {
    constructor(engine) {
        this.engine = engine;
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        
        // Set up event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        console.log('Input system initialized');
    }
    
    /**
     * Handle key down event
     */
    handleKeyDown(e) {
        this.keys[e.code] = true;
    }
    
    /**
     * Handle key up event
     */
    handleKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    /**
     * Check if a key is pressed
     */
    isKeyPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        const rect = this.engine.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        this.mouseDown = true;
    }
    
    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        this.mouseDown = false;
    }
    
    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        e.preventDefault();
        this.mouseDown = true;
        if (e.touches.length > 0) {
            const rect = this.engine.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
        }
    }
    
    /**
     * Handle touch move event
     */
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length > 0) {
            const rect = this.engine.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
            this.mouseY = e.touches[0].clientY - rect.top;
        }
    }
    
    /**
     * Handle touch end event
     */
    handleTouchEnd(e) {
        e.preventDefault();
        this.mouseDown = false;
    }
}