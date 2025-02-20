class UI {
    constructor() {
        this.historialContraseñas = this.loadFromLocalStorage();
        this.MAX_HISTORIAL = 5;
        this.setupThemeToggle();
        this.setupPasswordVisibility();
    }

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem('passwordHistory') || '[]');
    }

    saveToLocalStorage() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.historialContraseñas));
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.add(savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            document.body.classList.toggle('light');
            document.body.classList.toggle('dark');
            localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
        });
    }

    setupPasswordVisibility() {
        const toggleVisibility = document.getElementById('toggle-visibility');
        const passwordInput = document.getElementById('contrasena');
        
        toggleVisibility?.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            toggleVisibility.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }
}

export default UI;
