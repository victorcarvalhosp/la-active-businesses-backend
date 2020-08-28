"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
// lib/models/node.model.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../lib/database");
class Location extends sequelize_1.Model {
}
exports.Location = Location;
Location.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    businessId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    locationDescription: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    naics: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "locations",
    sequelize: database_1.database,
});
Location.sync({ force: false, alter: true }).then(() => console.log("Locations table created"));
//# sourceMappingURL=Location.js.map