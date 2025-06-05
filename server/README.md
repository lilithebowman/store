# E-Commerce Platform Server

This is the server-side of the E-Commerce Platform, built with Node.js and Express. The server handles all backend functionalities, including user authentication, product management, and order processing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [OAuth Integration](#oauth-integration)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/e-commerce-platform.git
   ```

2. Navigate to the server directory:
   ```
   cd e-commerce-platform/server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up your environment variables by copying the `.env.example` file to `.env` and filling in the required values.

## Usage

To start the server, run:
```
npm start
```

The server will run on `${window.location.hostname}:2048/api` by default.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login an existing user
  - `GET /api/auth/logout` - Logout the current user

- **Products**
  - `GET /api/products` - Get all products
  - `GET /api/products/:id` - Get a product by ID
  - `POST /api/products` - Create a new product (admin only)
  - `PUT /api/products/:id` - Update a product (admin only)
  - `DELETE /api/products/:id` - Delete a product (admin only)

- **Orders**
  - `GET /api/orders` - Get all orders (admin only)
  - `POST /api/orders` - Create a new order

## OAuth Integration

This server supports OAuth for user authentication. The OAuth providers are configured in the `server/services/oauthProviders.js` file. Ensure that you have the necessary credentials for the OAuth providers you wish to use.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.