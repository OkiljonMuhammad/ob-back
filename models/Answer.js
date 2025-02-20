import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Answer = sequelize.define(
  'Answer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    formId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Form',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Question',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
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
  { timestamps: true, tableName: 'Answer' }
);

export default Answer;
