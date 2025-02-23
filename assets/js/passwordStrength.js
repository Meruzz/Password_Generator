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
        const units = [
            { label: 'años', value: 31536000 },
            { label: 'días', value: 86400 },
            { label: 'hrs', value: 3600 },
            { label: 'mins', value: 60 },
            { label: 'segs', value: 1 }
        ];

        for (const unit of units) {
            if (seconds >= unit.value) {
                const value = Math.round(seconds / unit.value);
                if (unit.label === 'años' && value > 1e9) {
                    return 'más de mil millones de años';
                }
                return `${value} ${unit.label}`;
            }
        }

        return `${seconds.toFixed(2)} segs`;
    }
}
