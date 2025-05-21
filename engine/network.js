/**
 * TonioNetwork - Network system for TonioEngine
 * Handles multiplayer functionality
 */
class TonioNetwork {
    constructor(engine) {
        this.engine = engine;
        this.connected = false;
        this.socket = null;
        this.players = new Map();
        this.clientId = null;
        this.serverUrl = null; // Will be set when connecting
        this.events = {};
        
        console.log('Network system initialized');
    }
    
    /**
     * Connect to the multiplayer server
     */
    connect(serverUrl) {
        if (this.connected) {
            console.warn('Already connected to server');
            return;
        }
        
        this.serverUrl = serverUrl;
        console.log(`Attempting to connect to server at ${serverUrl}`);
        
        try {
            // This is a simplified version that simulates a connection
            // In a real implementation, this would be WebSocket or similar
            console.log('Simulating connection to multiplayer server');
            this.connected = true;
            this.clientId = 'player-' + Math.floor(Math.random() * 1000000);
            
            // Simulate connection success after a short delay
            setTimeout(() => {
                this.trigger('connect', { clientId: this.clientId });
                console.log(`Connected to server with client ID: ${this.clientId}`);
            }, 500);
        } catch (error) {
            console.error('Failed to connect to server:', error);
            this.trigger('error', { error: 'Connection failed' });
        }
    }
    
    /**
     * Disconnect from the server
     */
    disconnect() {
        if (!this.connected) {
            console.warn('Not connected to any server');
            return;
        }
        
        console.log('Disconnecting from server');
        this.connected = false;
        this.trigger('disconnect');
        this.players.clear();
    }
    
    /**
     * Send data to the server
     */
    send(event, data) {
        if (!this.connected) {
            console.warn('Cannot send data: Not connected to server');
            return;
        }
        
        console.log(`Sending data to server: ${event}`, data);
        
        // In a real implementation, this would send data over WebSocket
        // For this demo, we'll simulate responses for some events
        
        if (event === 'player_move') {
            // Simulate receiving the move from server after validation
            setTimeout(() => {
                this.trigger('player_move', {
                    playerId: this.clientId,
                    x: data.x,
                    y: data.y
                });
            }, 50); // Small delay to simulate network
            
            // Also simulate other players moving randomly
            for (const [playerId, player] of this.players) {
                if (playerId !== this.clientId) {
                    const randomMove = {
                        playerId: playerId,
                        x: player.x + (Math.random() * 20 - 10),
                        y: player.y + (Math.random() * 20 - 10)
                    };
                    setTimeout(() => {
                        this.trigger('player_move', randomMove);
                    }, 100 + Math.random() * 200);
                }
            }
        } else if (event === 'join_game') {
            // Simulate other players already in the game
            setTimeout(() => {
                // Generate 1-3 random players
                const playerCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < playerCount; i++) {
                    const playerId = 'player-' + Math.floor(Math.random() * 1000000);
                    const playerData = {
                        id: playerId,
                        name: `Player${i+1}`,
                        x: Math.random() * 1000 - 500,
                        y: Math.random() * 1000 - 500,
                        character: {
                            class: ['warrior', 'mage', 'ranger', 'rogue'][Math.floor(Math.random() * 4)],
                            appearance: [`type-a`, `type-b`, `type-c`][Math.floor(Math.random() * 3)]
                        }
                    };
                    
                    this.players.set(playerId, playerData);
                    
                    this.trigger('player_join', playerData);
                }
            }, 300);
            
            // Simulate our player joining acknowledgement
            setTimeout(() => {
                this.trigger('join_success', { 
                    playerId: this.clientId,
                    position: { x: data.x, y: data.y },
                    character: data.character
                });
            }, 200);
        }
    }
    
    /**
     * Register event handler
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    /**
     * Unregister event handler
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    /**
     * Trigger event
     */
    trigger(event, data) {
        if (!this.events[event]) return;
        for (const callback of this.events[event]) {
            callback(data);
        }
    }
    
    /**
     * Add player to the local player list
     */
    addPlayer(id, data) {
        this.players.set(id, data);
    }
    
    /**
     * Remove player from the local player list
     */
    removePlayer(id) {
        this.players.delete(id);
    }
    
    /**
     * Get player data
     */
    getPlayer(id) {
        return this.players.get(id);
    }
    
    /**
     * Get all players
     */
    getPlayers() {
        return Array.from(this.players.values());
    }
}