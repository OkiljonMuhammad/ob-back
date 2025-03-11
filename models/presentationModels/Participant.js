import { DataTypes } from 'sequelize';
import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';

const Participant = sequelizeForSlide.define(
  'Participant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Viewer',
      validate: {
        isIn: [["Creator", "Editor", "Viewer"]],
      },
    },
  },
  { timestamps: true, tableName: 'Participant' }
);

export default Participant;
