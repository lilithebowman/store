// Example setup file
require("@testing-library/jest-dom/extend-expect");

// Mock HTMLCanvasElement.getContext for tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
	clearRect: jest.fn(),
	fillText: jest.fn(),
	strokeText: jest.fn(),
	font: "",
	textAlign: "",
	textBaseline: "",
	strokeStyle: "",
	fillStyle: "",
	lineWidth: 0,
}));
