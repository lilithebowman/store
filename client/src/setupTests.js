// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock HTMLCanvasElement.getContext for tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
	clearRect: jest.fn(),
	fillText: jest.fn(),
	strokeText: jest.fn(),
	font: '',
	textAlign: '',
	textBaseline: '',
	strokeStyle: '',
	fillStyle: '',
	lineWidth: 0,
}));
