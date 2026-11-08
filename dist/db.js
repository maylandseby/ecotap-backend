"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = __importDefault(require("pg"));
const config_js_1 = require("./config/config.js");
const { Pool } = pg_1.default;
exports.pool = new Pool({
    connectionString: config_js_1.DATABASE_URL,
});
/**
 * Helper function to run database queries against PostgreSQL
 */
async function query(text, params) {
    const client = await exports.pool.connect();
    try {
        return await client.query(text, params);
    }
    finally {
        client.release();
    }
}
