import { factorial } from './calculate';
import { test, describe, expect } from "@jest/globals"; // Import Jest globals for testing

describe('factorial', () => {
    test('5! is 120', () => {
        expect(factorial(5)).toBe(120)
    });

    test('0! is 1', () => {
        expect(factorial(0)).toBe(1)
    });

    test('Factorial of negative int is throwing exception ', () => {
        expect(() => {
            factorial(-5);
        }).toThrow();
    });

    describe('product', () => {
        test('returns the correct product for positive integer input', () => {
            const term = k => k * 2;
            const expectedResult = 2 * 4 * 6 * 8 * 10;
            expect(product(5, term, 1)).toBe(expectedResult);
        });

        test('returns the correct product for custom term and initial values', () => {
            const term = k => k + 1;
            const expectedResult = (0 + 1) * (1 + 1) * (2 + 1);
            expect(product(3, term, 0)).toBe(expectedResult);
        });


    });
});
