import { DataTypes } from 'sequelize';
import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';


const Role = sequelizeForSlide.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, tableName: 'Role' }
);

export default Role;
