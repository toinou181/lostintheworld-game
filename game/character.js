/**
 * Character - Manages character creation and stats
 */
class CharacterSystem {
    constructor(game) {
        this.game = game;
        this.characterCreationElement = document.getElementById('character-creation');
        
        // Create character creation form
        this.createCharacterForm();
        
        this.defaultStats = {
            warrior: { strength: 10, intelligence: 4, agility: 6, vitality: 10 },
            mage: { strength: 3, intelligence: 12, agility: 5, vitality: 6 },
            ranger: { strength: 6, intelligence: 6, agility: 10, vitality: 8 },
            rogue: { strength: 7, intelligence: 5, agility: 12, vitality: 6 }
        };
    }
    
    /**
     * Create the character creation form
     */
    createCharacterForm() {
        // Create form
        const form = document.createElement('div');
        form.className = 'character-form';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Character Creation';
        form.appendChild(title);
        
        // Name input
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        nameGroup.appendChild(nameLabel);
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'character-name';
        nameInput.placeholder = 'Enter character name';
        nameGroup.appendChild(nameInput);
        
        form.appendChild(nameGroup);
        
        // Class selection
        const classGroup = document.createElement('div');
        classGroup.className = 'form-group';
        
        const classLabel = document.createElement('label');
        classLabel.textContent = 'Class:';
        classGroup.appendChild(classLabel);
        
        const classSelect = document.createElement('select');
        classSelect.id = 'character-class';
        
        const classes = [
            { value: 'warrior', name: 'Warrior' },
            { value: 'mage', name: 'Mage' },
            { value: 'ranger', name: 'Ranger' },
            { value: 'rogue', name: 'Rogue' }
        ];
        
        for (const characterClass of classes) {
            const option = document.createElement('option');
            option.value = characterClass.value;
            option.textContent = characterClass.name;
            classSelect.appendChild(option);
        }
        
        classGroup.appendChild(classSelect);
        form.appendChild(classGroup);
        
        // Appearance selection
        const appearanceGroup = document.createElement('div');
        appearanceGroup.className = 'form-group';
        
        const appearanceLabel = document.createElement('label');
        appearanceLabel.textContent = 'Appearance:';
        appearanceGroup.appendChild(appearanceLabel);
        
        const appearanceSelect = document.createElement('select');
        appearanceSelect.id = 'character-appearance';
        
        const appearances = [
            { value: 'type-a', name: 'Type A' },
            { value: 'type-b', name: 'Type B' },
            { value: 'type-c', name: 'Type C' }
        ];
        
        for (const appearance of appearances) {
            const option = document.createElement('option');
            option.value = appearance.value;
            option.textContent = appearance.name;
            appearanceSelect.appendChild(option);
        }
        
        appearanceGroup.appendChild(appearanceSelect);
        form.appendChild(appearanceGroup);
        
        // Form buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'form-buttons';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => this.hideCharacterCreation();
        buttonGroup.appendChild(cancelButton);
        
        const createButton = document.createElement('button');
        createButton.textContent = 'Create Character';
        createButton.onclick = () => this.submitCharacterForm();
        buttonGroup.appendChild(createButton);
        
        form.appendChild(buttonGroup);
        
        // Add form to character creation element
        this.characterCreationElement.innerHTML = '';
        this.characterCreationElement.appendChild(form);
        
        // Store callback reference
        this.onCreateCallback = null;
    }
    
    /**
     * Show character creation screen
     */
    showCharacterCreation(onComplete) {
        this.characterCreationElement.style.display = 'flex';
        this.onCreateCallback = onComplete;
    }
    
    /**
     * Hide character creation screen
     */
    hideCharacterCreation() {
        this.characterCreationElement.style.display = 'none';
        this.onCreateCallback = null;
    }
    
    /**
     * Handle form submission
     */
    submitCharacterForm() {
        const nameInput = document.getElementById('character-name');
        const classSelect = document.getElementById('character-class');
        const appearanceSelect = document.getElementById('character-appearance');
        
        const characterData = {
            name: nameInput.value || 'Player',
            class: classSelect.value,
            appearance: appearanceSelect.value
        };
        
        console.log('Character created:', characterData);
        
        // Create player with the character data
        const player = this.createCharacter(
            characterData.name,
            characterData.class,
            characterData.appearance
        );
        
        // Hide character creation
        this.hideCharacterCreation();
        
        // Call completion callback if exists
        if (this.onCreateCallback) {
            this.onCreateCallback(player);
        }
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