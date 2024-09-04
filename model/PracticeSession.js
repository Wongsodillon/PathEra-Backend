import { Sequelize } from "sequelize";
import db from "../Database.js";

const { DataTypes } = Sequelize;

const PracticeSession = db.define(
  "practice_sessions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    job_title: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default PracticeSession;
