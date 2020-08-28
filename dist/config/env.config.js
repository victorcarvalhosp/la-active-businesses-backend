"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.PASSWORD = exports.USER = exports.HOST = exports.API_AUTHORIZATION_TOKEN = void 0;
const dotenv = require("dotenv");
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
exports.API_AUTHORIZATION_TOKEN = process.env.API_AUTHORIZATION_TOKEN;
exports.HOST = process.env.HOST;
exports.USER = process.env.USER;
exports.PASSWORD = process.env.PASSWORD;
exports.DB = process.env.DB;
//# sourceMappingURL=env.config.js.map