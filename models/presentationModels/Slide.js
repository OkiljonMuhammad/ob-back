import { DataTypes } from 'sequelize';
import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';
import Presentation from './Presentation.js';
import 'dotenv/config';

const Slide = sequelizeForSlide.define(
  'Slide',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    presentationId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: Presentation, key: "id" } 
    },
  },
  {
    timestamps: true,
    tableName: 'Slide',
  }
);

export default Slide;
