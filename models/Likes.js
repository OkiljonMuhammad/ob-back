import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Likes = sequelize.define(
  'Likes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Template',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  { timestamps: true, tableName: 'Likes' }
);

export default Likes;
