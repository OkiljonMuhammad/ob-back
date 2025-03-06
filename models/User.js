import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Username must be unique',
      },
      validate: {
        len: {
          args: [3, 50],
          msg: 'Username must be between 3 and 50 characters',
        },
      },
      index: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email must be unique',
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
      index: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    apiToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: 'User',
    defaultScope: {
      where: { isBlocked: false },
    },
    scopes: {
      blocked: {
        where: { isBlocked: true },
      },
    },
  }
);

// Utility methods
User.prototype.isAdmin = function () {
  return this.role === process.env.ADMIN_ROLE;
};

User.prototype.hasAccess = function (userId) {
  return this.isAdmin() || this.id === userId;
};

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.generateApiToken = function () {
  this.apiToken = crypto.randomBytes(32).toString('hex');
  return this.save();
}
// Password hashing hooks
User.beforeCreate(async (user, options) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }
});

export default User;
