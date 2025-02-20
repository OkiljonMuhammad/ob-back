import Role from '../../models/Role.js';

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'roleName'],
    });

    res.status(200).json({
      message: 'Roles retrieved successfully.',
      roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getRoles;
