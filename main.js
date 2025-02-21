import { KeyboardSupport } from './assets/js/keyboardSupport.js';

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

const historialContraseñas = [];
const MAX_HISTORIAL = 5;

// Actualizar el valor mostrado de la longitud de la contraseña
longitud.addEventListener('input', function() {
    longitudValor.textContent = longitud.value;
});

// Configuración del tema
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(savedTheme);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', 
        document.body.classList.contains('light') ? 'light' : 'dark'
    );
});

// Configuración de visibilidad de contraseña
const toggleVisibility = document.getElementById('toggle-visibility');
toggleVisibility.addEventListener('click', () => {
    const type = contrasena.type === 'password' ? 'text' : 'password';
    contrasena.type = type;
    toggleVisibility.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Inicializar soporte de teclado
new KeyboardSupport();

// Agregar títulos con atajos de teclado
document.getElementById('generar').title = 'Generar contraseña (Alt + G)';
document.getElementById('copiar').title = 'Copiar contraseña (Alt + C)';
document.getElementById('limpiar').title = 'Limpiar contraseña (Alt + L)';
document.getElementById('theme-toggle').title = 'Cambiar tema (Alt + T)';
document.getElementById('toggle-visibility').title = 'Mostrar/ocultar contraseña (Alt + M)';

// Función para generar la contraseña
function generar() {
    let caracteresPermitidos = 'abcdefghijklmnopqrstuvwxyz';
    if (mayusculas.checked) caracteresPermitidos += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numeros.checked) caracteresPermitidos += '0123456789';
    if (simbolos.checked) caracteresPermitidos += '!@#$%^&*()_+[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < longitud.value; i++) {
        let caracterAleatorio = caracteresPermitidos[Math.floor(Math.random() * caracteresPermitidos.length)];
        password += caracterAleatorio;
    }

    contrasena.value = password;
    evaluarFuerza(password);

    // Guardar en historial
    if (password) {
        historialContraseñas.unshift(password);
        if (historialContraseñas.length > MAX_HISTORIAL) {
            historialContraseñas.pop();
        }
        actualizarHistorial();
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
    let score = 0;
    const strengthMeter = document.getElementById('strengthMeter');
    
    // Longitud (máximo 2 puntos)
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    // Tipos de caracteres (máximo 4 puntos)
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;

    // Actualizar indicador visual
    strengthMeter.className = 'strength-meter';
    fuerzaIndicador.style.color = '';

    // Determinar nivel basado en score total (máximo 6 puntos)
    if (score <= 2) {
        fuerzaIndicador.textContent = "Débil";
        fuerzaIndicador.style.color = "#ff4444";
        strengthMeter.classList.add('weak');
    } else if (score <= 3) {
        fuerzaIndicador.textContent = "Moderada";
        fuerzaIndicador.style.color = "#ffbb33";
        strengthMeter.classList.add('moderate');
    } else if (score <= 4) {
        fuerzaIndicador.textContent = "Fuerte";
        fuerzaIndicador.style.color = "#00C851";
        strengthMeter.classList.add('strong');
    } else {
        fuerzaIndicador.textContent = "Muy fuerte";
        fuerzaIndicador.style.color = "#007E33";
        strengthMeter.classList.add('very-strong');
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

boton.addEventListener('click', generar);
copiarBoton.addEventListener('click', copiarContrasena);
limpiarBoton.addEventListener('click', limpiarContrasena);