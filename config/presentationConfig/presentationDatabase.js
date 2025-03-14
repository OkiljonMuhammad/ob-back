import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelizeForSlide = new Sequelize(process.env.MYSQL_ADDON_URI, {
  dialect: "mysql",
});

// const sequelizeForSlide = new Sequelize(
//   process.env.DB_NAME_FOR_SLIDE,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//   }
// );

export default sequelizeForSlide;
