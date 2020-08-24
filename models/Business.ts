// lib/models/node.model.ts
import { DataTypes, Model } from "sequelize";
import { database } from "../lib/database";
import { Location } from "./Location";

export class Business extends Model {
  public id!: number;
  public name!: string;
  public startDate: Date;
  public totalLocations!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface BusinessInterface {
  id?: number;
  name: string;
  startDate: Date;
  totalLocations?: number;
}

Business.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalLocations: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "businesses",
    sequelize: database, // this bit is important
  }
);

Business.sync({ force: false, alter: true }).then(() => {
  Business.hasMany(Location, {
    sourceKey: "id",
    foreignKey: "businessId",
    as: "locations",
    onUpdate: "CASCADE",
    onDelete: "CASCADE", // this determines the name in `associations`!
  });
  console.log("Businesses table created");
});
