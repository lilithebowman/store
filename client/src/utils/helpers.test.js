import { formatCurrency, capitalizeFirstLetter, debounce } from './helpers';

describe('Helper Utilities', () => {
	describe('formatCurrency', () => {
		test('formats positive numbers correctly', () => {
			expect(formatCurrency(19.99)).toBe('$19.99');
			expect(formatCurrency(100)).toBe('$100.00');
			expect(formatCurrency(0.99)).toBe('$0.99');
		});

		test('formats zero correctly', () => {
			expect(formatCurrency(0)).toBe('$0.00');
		});

		test('formats negative numbers correctly', () => {
			expect(formatCurrency(-19.99)).toBe('-$19.99');
		});

		test('formats large numbers correctly', () => {
			expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
		});

		test('handles decimal precision', () => {
			expect(formatCurrency(19.9)).toBe('$19.90');
			expect(formatCurrency(19.999)).toBe('$20.00');
		});
	});

	describe('capitalizeFirstLetter', () => {
		test('capitalizes first letter of lowercase string', () => {
			expect(capitalizeFirstLetter('hello')).toBe('Hello');
			expect(capitalizeFirstLetter('world')).toBe('World');
		});

		test('handles already capitalized strings', () => {
			expect(capitalizeFirstLetter('Hello')).toBe('Hello');
			expect(capitalizeFirstLetter('WORLD')).toBe('WORLD');
		});

		test('handles empty string', () => {
			expect(capitalizeFirstLetter('')).toBe('');
		});

		test('handles single character', () => {
			expect(capitalizeFirstLetter('a')).toBe('A');
			expect(capitalizeFirstLetter('A')).toBe('A');
		});

		test('handles strings with spaces', () => {
			expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
		});

		test('handles special characters', () => {
			expect(capitalizeFirstLetter('123abc')).toBe('123abc');
			expect(capitalizeFirstLetter('!hello')).toBe('!hello');
		});
	});

	describe('debounce', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test('delays function execution', () => {
			const mockFn = jest.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();
			expect(mockFn).not.toHaveBeenCalled();

			jest.advanceTimersByTime(100);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		test('cancels previous calls when called multiple times', () => {
			const mockFn = jest.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();
			debouncedFn();
			debouncedFn();

			jest.advanceTimersByTime(100);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		test('passes arguments to debounced function', () => {
			const mockFn = jest.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn('arg1', 'arg2');
			jest.advanceTimersByTime(100);

			expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
		});

		test('handles different delay times', () => {
			const mockFn = jest.fn();
			const debouncedFn = debounce(mockFn, 250);

			debouncedFn();
			jest.advanceTimersByTime(100);
			expect(mockFn).not.toHaveBeenCalled();

			jest.advanceTimersByTime(150);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		test('resets timer on subsequent calls', () => {
			const mockFn = jest.fn();
			const debouncedFn = debounce(mockFn, 100);

			debouncedFn();
			jest.advanceTimersByTime(50);

			debouncedFn(); // This should reset the timer
			jest.advanceTimersByTime(50);
			expect(mockFn).not.toHaveBeenCalled();

			jest.advanceTimersByTime(50);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});
});
