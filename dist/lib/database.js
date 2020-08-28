"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const db_config_1 = require("../config/db.config");
const sequelize_1 = require("sequelize");
exports.database = new sequelize_1.Sequelize(db_config_1.dbConfig.DB, db_config_1.dbConfig.USER, db_config_1.dbConfig.PASSWORD, {
    host: db_config_1.dbConfig.HOST,
    dialect: "mysql",
});
/* If you want to run the database in memory, please comment the code above and use this one below */
// export const database = new Sequelize({
//   database: dbConfig.DB,
//   dialect: "sqlite",
//   storage: ":memory:",
// });
//# sourceMappingURL=database.js.map