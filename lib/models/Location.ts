// lib/models/node.model.ts
import { DataTypes, Model } from "sequelize";
import { database } from "../config/database";

export class Location extends Model {
  public id!: number;
  public name!: string;
  public businessId!: number;
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
  },
  {
    tableName: "locations",
    sequelize: database, // this bit is important
  }
);

//Location.belongsTo(Business);

Location.sync({ force: false, alter: true }).then(() =>
  console.log("Locations table created")
);
