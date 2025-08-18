import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

console.log('db/connection.js loaded (Neon serverless)');

export default sql;