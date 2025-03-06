import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Token = sequelize.define(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, tableName: 'Token' }
);

export default Token;
