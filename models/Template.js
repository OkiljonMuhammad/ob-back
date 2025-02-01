import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Template = sequelize.define("Template", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
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
},{timestamps: true});

export default Template;