export function calculateNewScore(currentScore, inputString) {
    if (!inputString || typeof inputString !== 'string' || inputString.trim() === "") {
        return currentScore;
    }
    
    // Normalize: 'x' -> '*', remove spaces
    let expr = inputString.toLowerCase().replace(/x/g, '*').replace(/\s/g, '');
    
    // Security: Whitelist characters
    expr = expr.replace(/[^0-9+\-*/().]/g, '');

    if (!expr) return currentScore;

    try {
        const firstChar = expr.charAt(0);
        let result;

        // Relative vs Absolute calculation
        if (['+', '-', '*', '/'].includes(firstChar)) {
            result = new Function('return ' + currentScore + expr)();
        } else {
            result = new Function('return ' + expr)();
        }

        if (isNaN(result)) return currentScore;
        
        return Math.floor(result);

    } catch (e) {
        return currentScore;
    }
}