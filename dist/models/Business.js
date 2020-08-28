"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = void 0;
// lib/models/node.model.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../lib/database");
const Location_1 = require("./Location");
class Business extends sequelize_1.Model {
}
exports.Business = Business;
Business.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    totalLocations: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "businesses",
    sequelize: database_1.database,
});
Business.sync({ force: false, alter: true }).then(() => {
    Business.hasMany(Location_1.Location, {
        sourceKey: "id",
        foreignKey: "businessId",
        as: "locations",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    });
    console.log("Businesses table created");
});
//# sourceMappingURL=Business.js.map