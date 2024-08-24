import { Sequelize } from "sequelize";
import db from "../Database.js";
import Users from "./Users.js"; // Ensure Users is imported correctly

const { DataTypes } = Sequelize;

const UsersExperience = db.define(
  "users_experience",
  {
    experience: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

// This establishes UsersExperience as having many Users
UsersExperience.hasMany(Users, {
  foreignKey: "experience_id", // Ensure this key exists on Users
  as: "Users", // This alias is how you will refer to the Users from a UsersExperience instance
});

export default UsersExperience;
