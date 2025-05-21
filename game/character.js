/**
 * Character - Manages character creation and stats
 */
class CharacterSystem {
    constructor(game) {
        this.game = game;
        this.defaultStats = {
            warrior: { strength: 10, intelligence: 4, agility: 6, vitality: 10 },
            mage: { strength: 3, intelligence: 12, agility: 5, vitality: 6 },
            ranger: { strength: 6, intelligence: 6, agility: 10, vitality: 8 },
            rogue: { strength: 7, intelligence: 5, agility: 12, vitality: 6 }
        };
    }
    
    /**
     * Start the character creation process
     */
    showCharacterCreation(onComplete) {
        const ui = this.game.engine.ui;
        
        ui.showCharacterCreation((character) => {
            console.log('Character created:', character);
            
            // Create player with the character data
            const player = this.createCharacter(
                character.name,
                character.class,
                character.appearance
            );
            
            if (onComplete) {
                onComplete(player);
            }
        });
    }
    
    /**
     * Create a character with the given attributes
     */
    createCharacter(name, characterClass, appearance) {
        // Validate and set defaults
        name = name || 'Player';
        characterClass = characterClass || 'warrior';
        appearance = appearance || 'type-a';
        
        // Create player entity
        const player = new Player(0, 0, name, characterClass, appearance);
        
        // Apply base stats for the class
        const stats = this.defaultStats[characterClass] || this.defaultStats.warrior;
        player.stats = { ...stats };
        
        // Add special abilities based on class
        player.abilities = this.getClassAbilities(characterClass);
        
        return player;
    }
    
    /**
     * Get abilities for a specific character class
     */
    getClassAbilities(characterClass) {
        const abilities = [];
        
        switch (characterClass) {
            case 'warrior':
                abilities.push({ name: 'Power Strike', description: 'A powerful melee attack' });
                abilities.push({ name: 'Shield Block', description: 'Block incoming damage' });
                break;
                
            case 'mage':
                abilities.push({ name: 'Fireball', description: 'Launch a ball of fire' });
                abilities.push({ name: 'Arcane Shield', description: 'Magical protection' });
                break;
                
            case 'ranger':
                abilities.push({ name: 'Precise Shot', description: 'Accurate ranged attack' });
                abilities.push({ name: 'Eagle Eye', description: 'Spot enemies from afar' });
                break;
                
            case 'rogue':
                abilities.push({ name: 'Backstab', description: 'Powerful attack from behind' });
                abilities.push({ name: 'Stealth', description: 'Become harder to detect' });
                break;
                
            default:
                abilities.push({ name: 'Basic Attack', description: 'A simple attack' });
        }
        
        return abilities;
    }
    
    /**
     * Save character data
     */
    saveCharacter(player) {
        try {
            const characterData = {
                name: player.name,
                class: player.characterClass,
                appearance: player.appearance,
                stats: player.stats,
                position: {
                    x: player.x,
                    y: player.y
                },
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('savedCharacter', JSON.stringify(characterData));
            console.log('Character saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save character:', error);
            return false;
        }
    }
    
    /**
     * Load character data
     */
    loadCharacter() {
        try {
            const savedData = localStorage.getItem('savedCharacter');
            if (!savedData) {
                console.log('No saved character found');
                return null;
            }
            
            const characterData = JSON.parse(savedData);
            console.log('Character loaded successfully:', characterData);
            
            // Create player from saved data
            const player = this.createCharacter(
                characterData.name,
                characterData.class,
                characterData.appearance
            );
            
            // Restore position
            if (characterData.position) {
                player.x = characterData.position.x;
                player.y = characterData.position.y;
            }
            
            // Restore stats
            if (characterData.stats) {
                player.stats = { ...characterData.stats };
            }
            
            return player;
        } catch (error) {
            console.error('Failed to load character:', error);
            return null;
        }
    }
    
    /**
     * Delete saved character
     */
    deleteCharacter() {
        try {
            localStorage.removeItem('savedCharacter');
            console.log('Character deleted successfully');
            return true;
        } catch (error) {
            console.error('Failed to delete character:', error);
            return false;
        }
    }
}