import { Sequelize } from "sequelize";
import db from "../Database.js";
import Users from "./Users.js"; // Ensure Users is imported correctly

const { DataTypes } = Sequelize;

const UsersExperience = db.define(
  "users_experience",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
      allowNull: false, // Ensure that each experience is linked to a user
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false, // Ensure that experience is provided
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(UsersExperience, {
  foreignKey: "user_id",
  as: "Experiences",
});

UsersExperience.belongsTo(Users, {
  foreignKey: "user_id",
  as: "User",
});

export default UsersExperience;
