import { Sequelize } from "sequelize";
import db from "../Database.js";
import PracticeSession from "./PracticeSession.js";

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
      allowNull: false,
    },
    question_id: {
      type: DataTypes.INTEGER,
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

(async () => {
  const PracticeSession = await import("./PracticeSession.js");
  const Question = await import("./Questions.js");
  AnswerDetails.belongsTo(PracticeSession.default, {
    foreignKey: "practice_session_id",
    as: "practiceSession",
  });

  PracticeSession.default.hasMany(AnswerDetails, {
    foreignKey: "practice_session_id",
    as: "answerDetails",
  });

  AnswerDetails.belongsTo(Question.default, {
    foreignKey: "question_id",
    as: "question",
  });
})();

export default AnswerDetails;
