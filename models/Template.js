import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Template = sequelize.define(
  'Template',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Topic',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tagIds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: true, tableName: 'Template' }
);

export default Template;
