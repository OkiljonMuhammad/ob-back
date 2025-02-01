import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const TemplateAccess = sequelize.define("TemplateAcces", {
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Template",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
        onDelete: "CASCADE",
    },
});

export default TemplateAccess;