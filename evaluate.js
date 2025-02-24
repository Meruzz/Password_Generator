import PasswordGenerator from './assets/js/passwordGenerator.js';
import { PasswordStrength } from './assets/js/passwordStrength.js';
import UI from './assets/js/ui.js';

const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    const toggleVisibility = document.getElementById('toggleVisibility');
    const passwordInput = document.getElementById('passwordInput');
    const resultsContainer = document.querySelector('.results-container');

    toggleVisibility.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        toggleVisibility.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    document.getElementById('evaluar').addEventListener('click', () => {
        const password = passwordInput.value;
        if (password) {
            evaluarFuerza(password);
            resultsContainer.style.display = 'block';
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('evaluar').click();
        }
    });
});

function evaluarFuerza(password) {
    const score = PasswordGenerator.evaluateStrength(password);
    actualizarIndicadores(score, password);
    actualizarRecomendaciones(password);
}

function actualizarIndicadores(score, password) {
    const normalizedScore = score * 20; // Convertir score 0-5 a 0-100
    const scoreNumber = document.getElementById('scoreNumber');
    scoreNumber.textContent = Math.round(normalizedScore);

    const strengthMeter = document.getElementById('strengthMeter');
    const fuerzaIndicador = document.getElementById('fuerza');
    
    const levels = [
        { score: 20, text: "Muy débil", color: "#ff4444", class: "very-weak" },
        { score: 40, text: "Débil", color: "#ff4444", class: "weak" },
        { score: 60, text: "Moderada", color: "#ffbb33", class: "moderate" },
        { score: 80, text: "Fuerte", color: "#00C851", class: "strong" },
        { score: 100, text: "Muy fuerte", color: "#007E33", class: "very-strong" }
    ];

    const level = levels.find(l => normalizedScore <= l.score) || levels[levels.length - 1];
    
    strengthMeter.className = 'strength-meter';
    strengthMeter.classList.add(level.class);
    fuerzaIndicador.textContent = level.text;
    fuerzaIndicador.style.color = level.color;

    const validations = PasswordGenerator.validatePassword(password);
    const crackTime = PasswordStrength.estimateCrackTime(password);
    
    actualizarAnalisisDetallado(validations, crackTime);
}

function actualizarAnalisisDetallado(validations, crackTime) {
    Object.entries(validations).forEach(([check, isValid]) => {
        const element = document.querySelector(`[data-check="${check}"]`);
        if (element) {
            element.className = isValid ? 'valid' : 'invalid';
            element.innerHTML = `${isValid ? '✓' : '✗'} ${element.textContent.split(' ').slice(1).join(' ')}`;
        }
    });

    const crackTimeElement = document.querySelector('.crack-time');
    if (crackTimeElement) {
        crackTimeElement.innerHTML = `<strong>Tiempo estimado para descifrar:</strong><br>${crackTime}`;
    }

    const crackDetails = document.getElementById('crackDetails');
    crackDetails.innerHTML = generarDetallesVulnerabilidad(crackTime);
}

function generarDetallesVulnerabilidad(crackTime) {
    const timeCategories = {
        'segundos': 'Extremadamente vulnerable',
        'minutos': 'Muy vulnerable',
        'horas': 'Vulnerable',
        'días': 'Moderadamente segura',
        'años': 'Segura',
        'millones': 'Muy segura'
    };

    let categoria = Object.entries(timeCategories).find(([key]) => crackTime.includes(key));
    return `<p class="vulnerability-category ${categoria ? categoria[0] : 'unknown'}">
                <strong>Nivel de vulnerabilidad:</strong><br>
                ${categoria ? categoria[1] : 'No determinado'}
            </p>`;
}

function actualizarRecomendaciones(password) {
    const recommendationsList = document.getElementById('recommendationsList');
    const recomendaciones = [];

    if (password.length < 12) {
        recomendaciones.push('Aumenta la longitud a al menos 12 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        recomendaciones.push('Añade letras mayúsculas');
    }
    if (!/[0-9]/.test(password)) {
        recomendaciones.push('Incluye números');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        recomendaciones.push('Agrega símbolos especiales');
    }
    if (/(.)\1{2,}/.test(password)) {
        recomendaciones.push('Evita caracteres repetidos consecutivos');
    }

    recommendationsList.innerHTML = recomendaciones.length ?
        recomendaciones.map(r => `<li>${r}</li>`).join('') :
        '<li>¡Excelente! Tu contraseña cumple con todos los criterios de seguridad.</li>';
}
