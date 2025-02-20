import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const FormAccess = sequelize.define(
  'FormAccess',
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
  { timestamps: true, tableName: 'FormAccess' }
);

export default FormAccess;
