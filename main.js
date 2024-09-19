
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
}

// función para copiar la contraseña al portapapeles
function copiarContrasena() {
    contrasena.select();
    document.execCommand('copy');
    alert('Contraseña copiada al portapapeles');
}

// función para limpiar el campo de contraseña
function limpiarContrasena() {
    contrasena.value = '';
    fuerzaIndicador.textContent = '';
    fuerzaIndicador.style.color = '';
}

// función para evaluar la fuerza de la contraseña
function evaluarFuerza(password) {
    let fuerza = 0;
    if (password.match(/[a-z]+/)) fuerza += 1;
    if (password.match(/[A-Z]+/)) fuerza += 1;
    if (password.match(/[0-9]+/)) fuerza += 1;
    if (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)) fuerza += 1;

    switch (fuerza) {
        case 0:
        case 1:
            fuerzaIndicador.textContent = "Débil";
            fuerzaIndicador.style.color = "red";
            break;
        case 2:
            fuerzaIndicador.textContent = "Moderada";
            fuerzaIndicador.style.color = "orange";
            break;
        case 3:
            fuerzaIndicador.textContent = "Fuerte";
            fuerzaIndicador.style.color = "yellow";
            break;
        case 4:
            fuerzaIndicador.textContent = "Muy fuerte";
            fuerzaIndicador.style.color = "green";
            break;
    }
}

boton.addEventListener('click', generar);
copiarBoton.addEventListener('click', copiarContrasena);
limpiarBoton.addEventListener('click', limpiarContrasena);