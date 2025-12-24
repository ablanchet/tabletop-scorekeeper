import { describe, it, expect } from 'vitest';
import { calculateNewScore } from '../src/logic/calculator';

describe('Score Calculator', () => {
    it('handles relative addition', () => {
        expect(calculateNewScore(10, "+5")).toBe(15);
    });
    it('handles relative subtraction', () => {
        expect(calculateNewScore(10, "-5")).toBe(5);
    });
    it('handles multiplication shortcut x', () => {
        expect(calculateNewScore(10, "x2")).toBe(20);
    });
    it('handles complex chaining', () => {
        expect(calculateNewScore(10, "+5x2")).toBe(30); 
    });
    it('ignores invalid text', () => {
        expect(calculateNewScore(10, "bad input")).toBe(10);
    });
});