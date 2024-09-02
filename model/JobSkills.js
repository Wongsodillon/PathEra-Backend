import { Sequelize } from "sequelize";
import db from "../Database.js";
import Jobs from "./Jobs.js";
import Skills from "./Skills.js";

const { DataTypes } = Sequelize;

const JobSkills = db.define(
  "job_skills",
  {
    job_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Jobs,
        key: "id",
      },
      primaryKey: true,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Skills,
        key: "id",
      },
      primaryKey: true,
    },
  },
  {
    freezeTableName: true,
  }
);

(async () => {
  const Jobs = (await import("./Jobs.js")).default;
  const Skills = (await import("./Skills.js")).default;

  Jobs.hasMany(JobSkills, { foreignKey: "job_id", as: "jobSkills" });
  JobSkills.belongsTo(Jobs, { foreignKey: "job_id", as: "jobID" });

  Skills.hasMany(JobSkills, { foreignKey: "skill_id", as: "jobSkills" });
  JobSkills.belongsTo(Skills, { foreignKey: "skill_id", as: "skill" });
})();

export default JobSkills;
