import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Topic = sequelize.define(
  'Topic',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topicName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, tableName: 'Topic' }
);

export default Topic;
