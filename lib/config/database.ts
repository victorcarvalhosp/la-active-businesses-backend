import { dbConfig } from "./db.config";
import { Sequelize } from "sequelize";

export const database = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: "mysql",
    define: {
      timestamps: false,
    },
  }
);
