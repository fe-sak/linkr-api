import pg from 'pg';

const { Pool } = pg;
console.log(process.env.DATABASE_URL);
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connection;
