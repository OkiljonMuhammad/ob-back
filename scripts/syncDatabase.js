import sequelize from '../config/database.js';
import '../models/index.js';
import '../models/AdminLog.js';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully ✅');

    await sequelize.sync({ force: true });
    console.log('Database synced ✅');
  } catch (error) {
    console.error('Error syncing database ❌', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
