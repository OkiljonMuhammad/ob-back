import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: "mysql",
});

export const sequelizeForSlide = new Sequelize(process.env.DB_URI, {
  dialect: "mysql",
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     port: process.env.DB_PORT,
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//   }
// );

export default sequelize;
