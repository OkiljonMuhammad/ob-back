import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Template from './Template.js';
import Tag from './Tag.js';

const TemplateTag = sequelize.define(
  'TemplateTag',
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
        model: Template, 
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tag,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  { timestamps: false, tableName: 'TemplateTag' }
);

export default TemplateTag;
