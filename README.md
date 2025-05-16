# e-commerce-platform

Welcome to the e-commerce platform project! This project is designed to provide a comprehensive online shopping experience, featuring a client-side application built with React and a server-side application powered by Node.js and Express. 

## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

The `client` directory contains the front-end application built with React. It includes:

- **Public Assets**: Static files such as `favicon.ico` and `index.html`.
- **Components**: Reusable UI components organized into common, layout, and product categories.
- **Contexts**: Context providers for managing authentication and cart state.
- **Hooks**: Custom hooks for handling authentication and cart logic.
- **Pages**: Different pages of the application, including Home, Product, Cart, Checkout, and Auth.
- **Services**: API and authentication service functions.
- **Utils**: Utility functions for various purposes.
- **Storybook**: A tool for developing and testing UI components in isolation.

### Server

The `server` directory contains the back-end application built with Node.js and Express. It includes:

- **Configuration**: Database and authentication configuration files.
- **Controllers**: Logic for handling requests related to authentication, orders, and products.
- **Middlewares**: Middleware functions for authentication and error handling.
- **Models**: Database models for Orders, Products, and Users.
- **Routes**: API endpoints for authentication, orders, products, and users.
- **Services**: Functions for handling OAuth providers.

## Features

- **User Authentication**: Implemented using OAuth for secure user management.
- **Product Listings**: Users can view and interact with a list of products.
- **Shopping Cart**: Users can add products to their cart and proceed to checkout.
- **Responsive Design**: The application is designed to work on various devices.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd e-commerce-platform
   ```

3. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

4. Install dependencies for the server:
   ```
   cd ../server
   npm install
   ```

5. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.
   - Create a new JWT secret
     - `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
     - or
     - `openssl rand -hex 64`
     - put the result in place of `your_jwt_secret`
     

6. Start the server:
   ```
   cd server
   npm start
   ```

7. Start the client:
   ```
   cd ../client
   npm start
   ```

8. Access the application in your browser at `http://localhost:3000`.

## Running Storybook

To develop and test components in isolation, you can run Storybook:

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Start Storybook:
   ```
   npm run storybook
   ```

3. Access Storybook in your browser at `http://localhost:6006`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.