import jwt from 'jsonwebtoken';
import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const DEFAULT_JWT_EXPIRATION = '1h';

export const generateToken = ({ id, role, username }) => {
  if (typeof id !== 'number' || typeof role !== 'string' || typeof username !== 'string') {
    throw new Error(
      "Invalid user data. Expected 'id' (number) and 'role' (string) and 'username' (string)."
    );
  }
  return jwt.sign({ id, role, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || DEFAULT_JWT_EXPIRATION,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw error;
  }
};
