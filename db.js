import { Pool } from "pg";
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectunauthorized: false}
});
module.exports = pool;