const { Client } = require('pg');

async function probe() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'password',
    database: 'orion_db',
  });
  try {
    await client.connect();
    console.log(`SUCCESS: postgres:password@localhost:5433/orion_db`);
    await client.end();
  } catch (err) {
    console.log(`FAILED: postgres:password@localhost:5433/orion_db - ${err.message}`);
  }
}

probe();
