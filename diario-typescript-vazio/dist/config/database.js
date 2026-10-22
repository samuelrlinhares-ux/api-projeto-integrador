"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.banco = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const database_json_1 = __importDefault(require("./database.json"));
exports.banco = promise_1.default.createPool({
    host: process.env.DB_HOST || database_json_1.default.host,
    port: Number(process.env.DB_PORT || database_json_1.default.port),
    user: process.env.DB_USER || database_json_1.default.user,
    password: process.env.DB_PASSWORD || database_json_1.default.password,
    database: process.env.DB_NAME || database_json_1.default.database,
    connectionLimit: 10
});