// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";
import { Location } from "./Location";

export class Business extends Model {
  public id!: number;
  public name!: string;
  public startDate: Date;
  public totalLocations!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/* define an interface which define properties we should receive from POST query. We only want to receive name property as String. 
We’ll use this interface to cast req.body object properties. This will prevent user to inject a parameters who we not want to save in database. 
This is a good practice. */
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
