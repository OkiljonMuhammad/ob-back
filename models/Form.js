import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Form = sequelize.define('Form', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    templateId: {
        type: DataTypes.INTEGER,
        references: {
            model: "Template",
            key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "User",
            key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
    },
    answers: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    dateFilled: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {tableName: "Form"});

export default Form;