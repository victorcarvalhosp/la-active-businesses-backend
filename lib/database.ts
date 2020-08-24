import { dbConfig } from "../config/db.config";
import { Sequelize } from "sequelize";

// export const database = new Sequelize(
//   dbConfig.DB,
//   dbConfig.USER,
//   dbConfig.PASSWORD,
//   {
//     host: dbConfig.HOST,
//     dialect: "mysql",
//     define: {
//       timestamps: false,
//     },
//   }
// );

/* If you want to run the database in memory, please comment the code above and use this one below */
export const database = new Sequelize({
  database: dbConfig.DB,
  dialect: "sqlite",
  storage: ":memory:",
});
