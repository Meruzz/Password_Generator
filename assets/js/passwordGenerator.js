class PasswordGenerator {
    static generateSecure(length, options) {
        // Usar Crypto API para mayor aleatoriedad
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (options.mayusculas) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.numeros) chars += '0123456789';
        if (options.simbolos) chars += '!@#$%^&*()_+[]{}|;:,.<>?';

        let password = '';
        array.forEach(x => password += chars[x % chars.length]);

        // Asegurar que se incluya al menos un carácter de cada tipo seleccionado
        if (options.mayusculas) password = this.ensureCharType(password, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (options.numeros) password = this.ensureCharType(password, '0123456789');
        if (options.simbolos) password = this.ensureCharType(password, '!@#$%^&*()_+[]{}|;:,.<>?');

        return password;
    }

    static ensureCharType(password, chars) {
        const pos = crypto.getRandomValues(new Uint8Array(1))[0] % password.length;
        const char = chars[crypto.getRandomValues(new Uint8Array(1))[0] % chars.length];
        return password.substring(0, pos) + char + password.substring(pos + 1);
    }

    static evaluateStrength(password) {
        let score = 0;
        
        // Longitud
        if (password.length >= 12) score += 2;
        else if (password.length >= 8) score += 1;

        // Complejidad
        if (password.match(/[a-z]/)) score += 1;
        if (password.match(/[A-Z]/)) score += 1;
        if (password.match(/[0-9]/)) score += 1;
        if (password.match(/[^a-zA-Z0-9]/)) score += 1;

        // Variedad de caracteres
        const uniqueChars = new Set(password).size;
        score += Math.floor(uniqueChars / 4);

        return Math.min(5, score); // Máximo 5 puntos
    }
}

export default PasswordGenerator;
