// lib/models/node.model.ts
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Business extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/* define an interface which define properties we should receive from POST query. We only want to receive name property as String. 
We’ll use this interface to cast req.body object properties. This will prevent user to inject a parameters who we not want to save in database. 
This is a good practice. */
export interface BusinessInterface {
  name: string;
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
  },
  {
    tableName: "businesses",
    sequelize: database, // this bit is important
  }
);

Business.sync({ force: true }).then(() =>
  console.log("Businesses table created")
);
