// lib/models/node.model.ts
import { DataTypes, Model } from "sequelize";
import { database } from "../lib/database";

export class Location extends Model {
  public id!: number;
  public name!: string;
  public businessId!: number;
  public city!: string;
  public locationDescription!: string;
  public naics: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/* define an interface which define properties we should receive from POST query. We only want to receive name property as String. 
We’ll use this interface to cast req.body object properties. This will prevent user to inject a parameters who we not want to save in database. 
This is a good practice. */
export interface LocationInterface {
  name: string;
  projectId: number;
}

Location.init(
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
    businessId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    naics: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "locations",
    sequelize: database, // this bit is important
  }
);

Location.sync({ force: false, alter: true }).then(() =>
  console.log("Locations table created")
);
