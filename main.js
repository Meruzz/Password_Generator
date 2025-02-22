import { KeyboardSupport } from './assets/js/keyboardSupport.js';
import PasswordGenerator from './assets/js/passwordGenerator.js';
import { PasswordStrength } from './assets/js/passwordStrength.js';
import UI from './assets/js/ui.js';

// Inicializar UI y soporte de teclado
const ui = new UI();
new KeyboardSupport();

// Variables globales
let historialContraseñas = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
const MAX_HISTORIAL = 5;

let longitud = document.getElementById('longitud');
let longitudValor = document.getElementById('longitudValor');
let mayusculas = document.getElementById('mayusculas');
let numeros = document.getElementById('numeros');
let simbolos = document.getElementById('simbolos');
let boton = document.getElementById('generar');
let contrasena = document.getElementById('contrasena');
let copiarBoton = document.getElementById('copiar');
let limpiarBoton = document.getElementById('limpiar');
let fuerzaIndicador = document.getElementById('fuerza');

// Actualizar el valor mostrado de la longitud de la contraseña
longitud.addEventListener('input', function() {
    longitudValor.textContent = longitud.value;
});

// Configuración del tema
const themeToggle = document.getElementById('theme-toggle');
const preferredTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(preferredTheme);

function toggleTheme() {
    const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Event listeners para el tema
themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

// Configuración de visibilidad de contraseña
const toggleVisibilityBtn = document.getElementById('toggle-visibility');
const passwordInput = document.getElementById('contrasena');

function togglePasswordVisibility() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleVisibilityBtn.innerHTML = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        toggleVisibilityBtn.innerHTML = '👁️';
    }
}

// Event listeners para mostrar/ocultar contraseña
toggleVisibilityBtn.addEventListener('click', togglePasswordVisibility);
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        togglePasswordVisibility();
    }
});

// Agregar títulos con atajos de teclado
document.getElementById('generar').title = 'Generar contraseña (Alt + G)';
document.getElementById('copiar').title = 'Copiar contraseña (Alt + C)';
document.getElementById('limpiar').title = 'Limpiar contraseña (Alt + L)';
document.getElementById('theme-toggle').title = 'Cambiar tema (Alt + T)';
document.getElementById('toggle-visibility').title = 'Mostrar/ocultar contraseña (Alt + M)';

// Función para generar la contraseña
function generar() {
    const options = {
        mayusculas: mayusculas.checked,
        numeros: numeros.checked,
        simbolos: simbolos.checked
    };

    const password = PasswordGenerator.generateSecure(parseInt(longitud.value), options);
    contrasena.value = password;
    evaluarFuerza(password);

    // Guardar en historial
    if (password) {
        historialContraseñas.unshift(password);
        if (historialContraseñas.length > MAX_HISTORIAL) {
            historialContraseñas.pop();
        }
        actualizarHistorial();
        localStorage.setItem('passwordHistory', JSON.stringify(historialContraseñas));
    }
}

// función para copiar la contraseña al portapapeles
function copiarContrasena() {
    if (contrasena.value) {
        navigator.clipboard.writeText(contrasena.value)
            .then(() => {
                const notificacion = document.getElementById('notificacion');
                notificacion.textContent = 'Contraseña copiada';
                notificacion.style.display = 'block';
                setTimeout(() => {
                    notificacion.style.display = 'none';
                }, 2000);
            })
            .catch(err => console.error('Error al copiar:', err));
    }
}

// función para limpiar el campo de contraseña
function limpiarContrasena() {
    contrasena.value = '';
    fuerzaIndicador.textContent = '';
    fuerzaIndicador.style.color = '';
}

// Función mejorada para evaluar la fuerza
function evaluarFuerza(password) {
    const score = PasswordGenerator.evaluateStrength(password);
    const strengthMeter = document.getElementById('strengthMeter');
    
    // Actualizar indicador visual
    strengthMeter.className = 'strength-meter';
    fuerzaIndicador.style.color = '';

    // Determinar nivel basado en score
    const levels = [
        { score: 2, text: "Débil", color: "#ff4444", class: "weak" },
        { score: 3, text: "Moderada", color: "#ffbb33", class: "moderate" },
        { score: 4, text: "Fuerte", color: "#00C851", class: "strong" },
        { score: 5, text: "Muy fuerte", color: "#007E33", class: "very-strong" }
    ];

    const level = levels.find(l => score <= l.score) || levels[levels.length - 1];
    fuerzaIndicador.textContent = level.text;
    fuerzaIndicador.style.color = level.color;
    strengthMeter.classList.add(level.class);

    // Actualizar análisis detallado
    const validations = PasswordGenerator.validatePassword(password);
    const crackTime = PasswordStrength.estimateCrackTime(password);
    actualizarAnalisis(validations, crackTime);
}

function actualizarAnalisis(validations, crackTime) {
    Object.entries(validations).forEach(([check, isValid]) => {
        const element = document.querySelector(`[data-check="${check}"]`);
        if (element) {
            element.className = isValid ? 'valid' : 'invalid';
            element.textContent = `${isValid ? '✓' : '✗'} ${element.textContent.split(' ').slice(1).join(' ')}`;
        }
    });

    const crackTimeElement = document.querySelector('.crack-time');
    if (crackTimeElement) {
        crackTimeElement.textContent = `Tiempo estimado de crackeo: ${crackTime}`;
    }
}

function actualizarHistorial() {
    const historialLista = document.getElementById('historial-lista');
    historialLista.innerHTML = '';
    historialContraseñas.forEach((pass, index) => {
        const li = document.createElement('li');
        // Truncar contraseña si es muy larga
        const passDisplay = pass.length > 25 ? pass.substring(0, 25) + '...' : pass;
        li.innerHTML = `<span title="${pass}">${passDisplay}</span>`;
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copiar';
        copyBtn.className = 'boton boton--pequeño';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(pass)
                .then(() => {
                    const notificacion = document.getElementById('notificacion');
                    notificacion.textContent = 'Contraseña copiada';
                    notificacion.style.display = 'block';
                    setTimeout(() => {
                        notificacion.style.display = 'none';
                    }, 2000);
                })
                .catch(err => console.error('Error al copiar:', err));
        };
        li.appendChild(copyBtn);
        historialLista.appendChild(li);
    });
}

// Función para exportar contraseñas
function exportarContraseñas() {
    const texto = historialContraseñas.join('\n');
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contraseñas_generadas.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Agregar el event listener para el botón de exportar
const exportarBoton = document.getElementById('exportar');
if (exportarBoton) {
    exportarBoton.addEventListener('click', exportarContraseñas);
}

boton.addEventListener('click', generar);
copiarBoton.addEventListener('click', copiarContrasena);
limpiarBoton.addEventListener('click', limpiarContrasena);