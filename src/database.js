import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connection;
