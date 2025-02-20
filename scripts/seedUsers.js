import db from '../models/index.js';

const seedUsers = async () => {
  try {
    const newUser = await db.User.create({
      username: 'admin2',
      email: 'admin2@gmail.com',
      password: '123456',
      role: 'admin',
    });

    console.log('New user created:', newUser);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    process.exit();
  }
};

seedUsers();
