import { DataTypes } from 'sequelize';
import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';
import 'dotenv/config';

const User = sequelizeForSlide.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
  },
  {
    timestamps: true,
    tableName: 'User',
  }
);

export default User;
