import db from '../models/index.js';

const createRole = async () => {
  try {
    const newRole = await db.Role.create({
      roleName: 'admin',
    });

    console.log('New role created:', newRole);
  } catch (error) {
    console.error('Error creating role:', error);
  } finally {
    process.exit();
  }
};

createRole();
