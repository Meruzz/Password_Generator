export class KeyboardSupport {
    constructor() {
        this.shortcuts = {
            'Alt+G': 'Generar contraseña',
            'Alt+C': 'Copiar contraseña',
            'Alt+L': 'Limpiar contraseña',
            'Alt+T': 'Cambiar tema',
            'Alt+M': 'Mostrar/ocultar contraseña',
            '↑/↓': 'Navegar historial',
            'Tab': 'Navegar elementos',
            'Enter': 'Activar botón/control'
        };

        this.setupKeyboardListeners();
        this.initializeKeyboardInfo();
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch(e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        document.getElementById('generar')?.click();
                        break;
                    case 'c':
                        e.preventDefault();
                        document.getElementById('copiar')?.click();
                        break;
                    case 'l':
                        e.preventDefault();
                        document.getElementById('limpiar')?.click();
                        break;
                }
            }
        });

        // Navegación en el historial
        document.getElementById('historial-lista')?.addEventListener('keydown', (e) => {
            const items = [...document.querySelectorAll('#historial-lista button')];
            const currentIndex = items.indexOf(document.activeElement);

            if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                items[currentIndex - 1].focus();
            } else if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
                e.preventDefault();
                items[currentIndex + 1].focus();
            }
        });
    }

    initializeKeyboardInfo() {
        const infoHTML = `
            <div class="keyboard-shortcuts-info" tabindex="0">
                <button class="keyboard-info-toggle" aria-label="Mostrar atajos de teclado">⌨️</button>
                <div class="keyboard-shortcuts-panel">
                    <h3>Atajos de teclado</h3>
                    <ul>
                        ${Object.entries(this.shortcuts)
                            .map(([key, desc]) => `<li><kbd>${key}</kbd> - ${desc}</li>`)
                            .join('')}
                    </ul>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', infoHTML);
    }
}
