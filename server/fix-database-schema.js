const { sequelize } = require('./config/database');

async function fixDatabaseSchema() {
	try {
		console.log('🔄 Connecting to database...');
		await sequelize.authenticate();
		console.log('✅ Database connection established.');

		// Check if roles column exists
		console.log('🔍 Checking for roles column...');
		const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE || 'lilithe'}' 
            AND TABLE_NAME = 'Users' 
            AND COLUMN_NAME = 'roles'
        `);

		if (results.length === 0) {
			console.log('⚠️  Roles column missing. Adding it now...');

			// Add the roles column
			await sequelize.query(`
                ALTER TABLE Users 
                ADD COLUMN roles VARCHAR(255) NULL DEFAULT NULL 
                COMMENT 'Comma-separated list of role IDs'
            `);

			console.log('✅ Roles column added successfully!');
		} else {
			console.log('✅ Roles column already exists.');
		}

		// Check if profileImage column exists (just in case)
		console.log('🔍 Checking for profileImage column...');
		const [profileResults] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE || 'lilithe'}' 
            AND TABLE_NAME = 'Users' 
            AND COLUMN_NAME = 'profileImage'
        `);

		if (profileResults.length === 0) {
			console.log('⚠️  ProfileImage column missing. Adding it now...');

			// Add the profileImage column
			await sequelize.query(`
                ALTER TABLE Users 
                ADD COLUMN profileImage VARCHAR(255) NULL
            `);

			console.log('✅ ProfileImage column added successfully!');
		} else {
			console.log('✅ ProfileImage column already exists.');
		}

		// Show current table structure
		console.log('📋 Current Users table structure:');
		const [columns] = await sequelize.query(`
            DESCRIBE Users
        `);

		columns.forEach(col => {
			console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
		});

		console.log('🎉 Database schema fix completed!');

	} catch (error) {
		console.error('❌ Error fixing database schema:', error.message);
		process.exit(1);
	} finally {
		await sequelize.close();
		console.log('🔒 Database connection closed.');
		process.exit(0);
	}
}

fixDatabaseSchema();
