import db from '../../models/index.js';

const generateApiToken = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userWithApiToken = await user.generateApiToken();
    res.status(201).json({ 
      message: 'Api Token created successfully.', 
      api_token: userWithApiToken.apiToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default generateApiToken;
