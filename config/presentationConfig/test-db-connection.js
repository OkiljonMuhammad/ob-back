import sequelizeForSlide from './presentationDatabase.js';

async function testDatabaseConnection() {
  try {
    await sequelizeForSlide.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  } finally {
    await sequelizeForSlide.close();
    console.log('Database connection closed.');
  }
}

testDatabaseConnection();
