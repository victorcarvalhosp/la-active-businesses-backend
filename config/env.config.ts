import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "test":
    path = `${__dirname}/../../.env.test`;
    break;
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}
dotenv.config({ path: path });

export const API_AUTHORIZATION_TOKEN = process.env.API_AUTHORIZATION_TOKEN;
export const API_URL = process.env.API_URL;

export const HOST = process.env.HOST;
export const USER = process.env.USER;
export const PASSWORD = process.env.PASSWORD;
export const DB = process.env.DB;
