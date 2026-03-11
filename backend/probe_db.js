const { Client } = require('pg');

async function probe() {
  const combos = [
    { user: 'user', password: 'password', database: 'orion_db' },
    { user: 'postgres', password: 'password', database: 'orion_db' },
    { user: 'postgres', password: 'password', database: 'postgres' },
    { user: 'postgres', password: '', database: 'postgres' },
  ];

  for (const config of combos) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    try {
      await client.connect();
      console.log(`SUCCESS: ${config.user}:${config.password}@localhost/${config.database}`);
      await client.end();
      return;
    } catch (err) {
      console.log(`FAILED: ${config.user}:${config.password}@localhost/${config.database} - ${err.message}`);
    }
  }
}

probe();
