import { DataTypes } from 'sequelize';
import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';
import Slide from './Slide.js';
import 'dotenv/config';

const TextBlock = sequelizeForSlide.define(
  'TextBlock',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slideId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: Slide, key: "id" } 
    },
  },
  {
    timestamps: true,
    tableName: 'TextBlock',
  }
);

export default TextBlock;
