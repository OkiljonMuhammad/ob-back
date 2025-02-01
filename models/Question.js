import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Question = sequelize.define("Question", {
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Template",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    type: {
        type: DataTypes.ENUM("single-line", "multi-line", "integer", "checkbox"),
        allowNull: false,
        },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVisibleInTable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

export default Question;