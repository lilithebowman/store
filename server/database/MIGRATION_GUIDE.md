# Database Abstraction Layer Migration Guide

This guide explains how to use the new database abstraction layer that supports multiple database types.

## Overview

The database abstraction layer provides a unified interface for different database types:

- **SQL Databases**: MySQL, PostgreSQL, SQLite, MariaDB, SQL Server (via Sequelize)
- **NoSQL Databases**: MongoDB (via Mongoose)
- **Extensible**: Easy to add new database types

## Quick Start

### 1. Environment Configuration

Add these variables to your `.env` file:

```env
# Choose your database type
DB_TYPE=mysql          # Options: mysql, postgres, sqlite, mongodb, mariadb, mssql

# Connection details
DB_HOST=localhost
DB_PORT=3306           # 5432 for postgres, 27017 for mongodb
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=yourpassword

# Optional: Use connection URL instead
# DATABASE_URL=mysql://root:password@localhost:3306/ecommerce_db
```

### 2. Using the New System

The abstraction layer maintains backward compatibility while providing new features:

```javascript
// Old way (still works)
const { sequelize } = require('./config/database');

// New way (recommended)
const { databaseManager } = require('./config/database');

// Get a model (works with both old and new)
const User = require('./models/User');

// Or use the abstraction layer directly
const user = await databaseManager.getDatabase().create('User', userData);
```

## Database Types Supported

### MySQL (Default)

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=yourpassword
```

### PostgreSQL

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=yourpassword
```

### SQLite

```env
DB_TYPE=sqlite
DB_NAME=ecommerce_db.sqlite
# No host/port needed for SQLite
```

### MongoDB

```env
DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=ecommerce_db
DB_USER=mongouser
DB_PASSWORD=mongopassword
```

## API Reference

### DatabaseManager Methods

```javascript
const { databaseManager } = require('./config/database');

// Initialize database
await databaseManager.initialize();

// Get database instance
const db = databaseManager.getDatabase();

// CRUD operations
const user = await db.create('User', { username: 'john', email: 'john@example.com' });
const users = await db.findAll('User', { where: { isAdmin: false } });
const user = await db.findByPk('User', 1);
await db.update('User', { isAdmin: true }, { where: { id: 1 } });
await db.destroy('User', { where: { id: 1 } });

// Transactions
await db.transaction(async (transaction) => {
    await db.create('User', userData, { transaction });
    await db.create('Profile', profileData, { transaction });
});

// Health check
const isHealthy = await databaseManager.healthCheck();
```

### Model Base Class

For new models, you can extend the ModelBase class:

```javascript
const ModelBase = require('../database/ModelBase');

class UserModel extends ModelBase {
    constructor(database) {
        super(database, 'User');
    }

    async findByEmail(email) {
        return await this.findOne({ where: { email } });
    }

    async createWithProfile(userData, profileData) {
        return await this.transaction(async (transaction) => {
            const user = await this.create(userData, { transaction });
            const profile = await this.database.create('Profile', {
                ...profileData,
                userId: user.id
            }, { transaction });
            return { user, profile };
        });
    }
}
```

## Migration Steps

### 1. Gradual Migration (Recommended)

The system supports both old and new approaches simultaneously:

```javascript
// controllers/userController.js

// Old way (still works)
const User = require('../models/User');
const users = await User.findAll();

// New way (recommended for new code)
const { getModel } = require('../config/database');
const UserModel = getModel('User');
const users = await UserModel.findAll();

// Or use abstraction layer directly
const { databaseManager } = require('../config/database');
const users = await databaseManager.getDatabase().findAll('User');
```

### 2. Update Controllers Gradually

Replace Sequelize-specific calls with abstraction layer calls:

```javascript
// Before
const users = await User.findAll({
    include: ['orders'],
    where: { isActive: true }
});

// After
const db = databaseManager.getDatabase();
const users = await db.findAll('User', {
    include: ['orders'],
    where: { isActive: true }
});
```

### 3. Switch Database Types

To switch from MySQL to PostgreSQL:

### 1. Update your `.env` file

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
# ... other postgres settings
```

### 2. Install PostgreSQL driver

```bash
npm install pg pg-hstore
```

### 3. Restart your application - no code changes needed

## Testing Different Databases

You can test your application with different databases:

```javascript
// test/database.test.js
const { DatabaseManager } = require('../server/database/DatabaseManager');

describe('Database Tests', () => {
    const databases = [
        { type: 'sqlite', storage: ':memory:' },
        { type: 'mysql', host: 'localhost', database: 'test_db' },
        // { type: 'mongodb', host: 'localhost', database: 'test_db' }
    ];

    databases.forEach(config => {
        describe(`${config.type} Database`, () => {
            let dbManager;

            beforeEach(async () => {
                dbManager = new DatabaseManager();
                await dbManager.initialize(config);
            });

            afterEach(async () => {
                await dbManager.close();
            });

            it('should create and find users', async () => {
                const db = dbManager.getDatabase();
                const user = await db.create('User', {
                    username: 'test',
                    email: 'test@example.com'
                });
                expect(user.username).toBe('test');

                const foundUser = await db.findByPk('User', user.id);
                expect(foundUser.email).toBe('test@example.com');
            });
        });
    });
});
```

## Performance Considerations

- **Connection Pooling**: Automatically configured for SQL databases
- **Caching**: Implement caching at the service layer, not database layer
- **Indexes**: Define indexes in your model definitions
- **Transactions**: Use transactions for multi-step operations

## Troubleshooting

### Common Issues

1. **"Model not found" errors**: Make sure models are defined before use
2. **Connection errors**: Check your database is running and credentials are correct
3. **Migration issues**: Use the health check endpoint to verify database status

### Health Check Endpoint

Add this to your routes for monitoring:

```javascript
// routes/health.js
app.get('/health/database', async (req, res) => {
    const { databaseManager } = require('../config/database');
    
    const isHealthy = await databaseManager.healthCheck();
    const dbType = databaseManager.getDatabaseType();
    
    res.json({
        database: {
            type: dbType,
            healthy: isHealthy,
            connected: databaseManager.isConnectedToDatabase()
        }
    });
});
```

## Next Steps

1. **Start with your current MySQL setup** - no changes needed initially
2. **Gradually update controllers** to use the abstraction layer
3. **Test with different databases** using the same codebase
4. **Add new database types** by implementing the DatabaseInterface

The abstraction layer provides flexibility while maintaining backward compatibility with your existing code.
