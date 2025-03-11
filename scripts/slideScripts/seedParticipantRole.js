import Role from '../../models/presentationModels/Role.js';

const createParticipantRole = async () => {
  try {
    const newRole = await Role.create({
      roleName: 'Viewer',
    });

    console.log('New role created:', newRole);
  } catch (error) {
    console.error('Error creating role:', error);
  } finally {
    process.exit();
  }
};

createParticipantRole();
