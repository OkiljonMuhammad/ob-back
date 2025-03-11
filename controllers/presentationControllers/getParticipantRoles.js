import Role from '../../models/presentationModels/Role.js';

const getParticipantRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'roleName'],
    });

    res.status(200).json({
      message: 'Roles retrieved successfully.',
      participantRoles: roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getParticipantRoles;
