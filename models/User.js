import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
        },
    },
    role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
},
{   
    timestamps: true, 
    tableName: "User",
});

User.prototype.isAdmin = function() {
    return this.role === "admin";
};

User.prototype.canEditTemplate = function(templateOwnerId) {
    return this.isAdmin() || this.id === templateOwnerId;
};

User.prototype.canDeleteUser = function(targetUser) {
    return this.isAdmin() && targetUser.id !== this.id; 
};

User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

User.beforeCreate( async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

});

User.beforeUpdate( async (user, options) => {
    if(user.changed("password")) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
});
export default User;