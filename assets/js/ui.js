class UI {
    constructor() {
        this.historialContraseñas = this.loadFromLocalStorage();
        this.MAX_HISTORIAL = 5;
        this.setupThemeToggle();
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

        function toggleTheme() {
            const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        }

        themeToggle?.addEventListener('click', toggleTheme);
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
}

export default UI;
