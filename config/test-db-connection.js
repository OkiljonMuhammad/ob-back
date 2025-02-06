import sequelize from './database.js';

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testDatabaseConnection();
