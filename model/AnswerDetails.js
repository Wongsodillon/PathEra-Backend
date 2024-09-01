import { Sequelize } from "sequelize";
import db from "../Database.js";
import PracticeSession from "./PracticeSession.js";
import Questions from "./Questions.js";

const { DataTypes } = Sequelize;

const AnswerDetails = db.define(
  "answer_details",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    practice_session_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "practice_sessions",
        key: "id",
      },
      allowNull: false,
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "questions",
        key: "id",
      },
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    sample_answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default AnswerDetails;
