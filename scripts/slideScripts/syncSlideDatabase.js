import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';
import '../../models/presentationModels/index.js';
import '../../models/presentationModels/Role.js';
const syncDatabase = async () => {
  try {
    await sequelizeForSlide.authenticate();
    console.log('Database connected successfully ✅');

    await sequelizeForSlide.sync({ force: true });
    console.log('Database synced ✅');
  } catch (error) {
    console.error('Error syncing database ❌', error);
  } finally {
    await sequelizeForSlide.close();
  }
};

syncDatabase();
