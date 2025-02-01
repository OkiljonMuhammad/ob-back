import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Form = sequelize.define('Form', {
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
});

export default Form;