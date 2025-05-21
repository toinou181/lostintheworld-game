/**
 * TonioUI - UI system for TonioEngine
 */
class TonioUI {
    constructor(engine) {
        this.engine = engine;
        this.elements = [];
        this.activeMenus = [];
        this.menuContainer = document.getElementById('menu-container');
        
        console.log('UI system initialized');
    }
    
    /**
     * Show a menu
     */
    showMenu(menuId) {
        // Hide all menus first
        this.hideAllMenus();
        
        // Show the requested menu
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'block';
            this.activeMenus.push(menuId);
        }
    }
    
    /**
     * Hide a menu
     */
    hideMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = 'none';
            const index = this.activeMenus.indexOf(menuId);
            if (index !== -1) {
                this.activeMenus.splice(index, 1);
            }
        }
    }
    
    /**
     * Hide all menus
     */
    hideAllMenus() {
        const menus = this.menuContainer.getElementsByClassName('menu');
        for (const menu of menus) {
            menu.style.display = 'none';
        }
        this.activeMenus = [];
    }
    
    /**
     * Create a menu with buttons
     */
    createMenu(menuId, title, buttons) {
        // Create menu container
        const menuDiv = document.createElement('div');
        menuDiv.id = menuId;
        menuDiv.className = 'menu';
        menuDiv.style.display = 'none';
        
        // Add title
        const titleElement = document.createElement('h1');
        titleElement.textContent = title;
        menuDiv.appendChild(titleElement);
        
        // Add buttons
        for (const button of buttons) {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'menu-button';
            buttonElement.textContent = button.text;
            buttonElement.addEventListener('click', button.action);
            menuDiv.appendChild(buttonElement);
        }
        
        // Add to menu container
        this.menuContainer.appendChild(menuDiv);
        
        return menuDiv;
    }
    
    /**
     * Show character creation screen
     */
    showCharacterCreation(onSubmit) {
        const characterCreation = document.getElementById('character-creation');
        characterCreation.innerHTML = '';
        characterCreation.style.display = 'flex';
        
        const form = document.createElement('form');
        form.className = 'character-form';
        
        const title = document.createElement('h2');
        title.textContent = 'Create Your Character';
        form.appendChild(title);
        
        // Name field
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Character Name:';
        nameLabel.setAttribute('for', 'character-name');
        nameGroup.appendChild(nameLabel);
        
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'character-name';
        nameInput.required = true;
        nameGroup.appendChild(nameInput);
        
        form.appendChild(nameGroup);
        
        // Class selection
        const classGroup = document.createElement('div');
        classGroup.className = 'form-group';
        
        const classLabel = document.createElement('label');
        classLabel.textContent = 'Character Class:';
        classLabel.setAttribute('for', 'character-class');
        classGroup.appendChild(classLabel);
        
        const classSelect = document.createElement('select');
        classSelect.id = 'character-class';
        
        const classes = ['Warrior', 'Mage', 'Ranger', 'Rogue'];
        for (const cls of classes) {
            const option = document.createElement('option');
            option.value = cls.toLowerCase();
            option.textContent = cls;
            classSelect.appendChild(option);
        }
        
        classGroup.appendChild(classSelect);
        form.appendChild(classGroup);
        
        // Appearance options
        const appearanceGroup = document.createElement('div');
        appearanceGroup.className = 'form-group';
        
        const appearanceLabel = document.createElement('label');
        appearanceLabel.textContent = 'Appearance:';
        appearanceLabel.setAttribute('for', 'character-appearance');
        appearanceGroup.appendChild(appearanceLabel);
        
        const appearanceSelect = document.createElement('select');
        appearanceSelect.id = 'character-appearance';
        
        const appearances = ['Type A', 'Type B', 'Type C'];
        for (const appearance of appearances) {
            const option = document.createElement('option');
            option.value = appearance.toLowerCase().replace(' ', '-');
            option.textContent = appearance;
            appearanceSelect.appendChild(option);
        }
        
        appearanceGroup.appendChild(appearanceSelect);
        form.appendChild(appearanceGroup);
        
        // Form buttons
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'form-buttons';
        
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            characterCreation.style.display = 'none';
        });
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Create';
        
        buttonGroup.appendChild(cancelButton);
        buttonGroup.appendChild(submitButton);
        form.appendChild(buttonGroup);
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const character = {
                name: nameInput.value,
                class: classSelect.value,
                appearance: appearanceSelect.value
            };
            
            characterCreation.style.display = 'none';
            
            if (onSubmit) {
                onSubmit(character);
            }
        });
        
        characterCreation.appendChild(form);
    }
    
    /**
     * Hide character creation screen
     */
    hideCharacterCreation() {
        const characterCreation = document.getElementById('character-creation');
        characterCreation.style.display = 'none';
    }
    
    /**
     * Show a message box
     */
    showMessage(message, duration = 3000) {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.textContent = message;
        
        document.body.appendChild(messageBox);
        
        setTimeout(() => {
            messageBox.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 500);
        }, duration);
    }
}