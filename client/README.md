# E-Commerce Platform Client

This is the client-side application for the E-Commerce Platform, built using React. The application is structured to facilitate the development of reusable components, manage authentication, and provide a seamless user experience.

## Getting Started

To get started with the client application, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd e-commerce-platform/client
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Storybook

The project utilizes Storybook for developing and testing UI components in isolation. To run Storybook, use the following command:

```
npm run storybook
```

This will open Storybook in your browser, where you can view and interact with the components.

## Folder Structure

- **public/**: Contains static files such as the favicon and the main HTML file.
- **src/**: Contains the source code for the application.
  - **assets/**: Contains images and other static assets.
  - **components/**: Contains reusable UI components.
    - **common/**: Commonly used components like Button and Input.
    - **layout/**: Layout components such as Header, Footer, and Sidebar.
    - **product/**: Components related to product display, including ProductCard and ProductList.
  - **contexts/**: Contains context providers for managing global state (e.g., authentication and cart).
  - **hooks/**: Custom hooks for encapsulating logic.
  - **pages/**: Contains the main pages of the application.
  - **services/**: Contains service files for API calls and authentication.
  - **utils/**: Utility functions used throughout the application.
  - **App.jsx**: The main application component.
  - **index.jsx**: The entry point for the React application.

## Authentication

The application implements OAuth for user creation and management. Users can sign up and log in using various OAuth providers.

## Testing

Each component includes corresponding test files to ensure functionality and reliability. Use the following command to run tests:

```
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.