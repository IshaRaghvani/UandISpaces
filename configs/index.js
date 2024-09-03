// index.js (or index.ts)
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const schema = require('./schema');  // Ensure this path is correct

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL_CONFIG);
const db = drizzle(sql, { schema });

module.exports = { db };
