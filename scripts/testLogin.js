import User from '../models/User.js';

const testLogin = async () => {
  try {
    const user = await User.findOne({ where: { email: 'john@example.com' } });

    if (!user) {
      console.log('User not found');
      return;
    }

    const isMatch = await user.comparePassword('mySecurePassword123');

    if (isMatch) {
      console.log('Login successfull!');
    } else {
      console.log('Invalid password');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};

testLogin();
