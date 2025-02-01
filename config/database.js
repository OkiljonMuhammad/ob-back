import { Sequelize }  from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: "mysql",
});

export default sequelize;