import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Question = sequelize.define(
  'Question',
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['single-line', 'multi-line', 'integer', 'checkbox']],
      },
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVisibleInTable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: 'Question' }
);

export default Question;
