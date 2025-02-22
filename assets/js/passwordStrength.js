export class PasswordStrength {
    static estimateCrackTime(password) {
        const charset = this.getCharsetSize(password);
        const combinations = Math.pow(charset, password.length);
        const guessesPerSecond = 1000000000; // 1 billón de intentos por segundo
        const seconds = combinations / guessesPerSecond;

        return this.formatTime(seconds);
    }

    static getCharsetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26;
        if (/[A-Z]/.test(password)) size += 26;
        if (/[0-9]/.test(password)) size += 10;
        if (/[^A-Za-z0-9]/.test(password)) size += 33;
        return size;
    }

    static formatTime(seconds) {
        if (seconds < 60) return `${Math.round(seconds)} segundos`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutos`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} días`;
        return `${Math.round(seconds / 31536000)} años`;
    }
}
