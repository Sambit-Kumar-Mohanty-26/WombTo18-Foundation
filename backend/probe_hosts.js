const { Client } = require('pg');

async function probe() {
  const hosts = ['127.0.0.1', 'localhost', '0.0.0.0'];
  const user = 'postgres';
  const password = 'password';
  const database = 'orion_db';

  for (const host of hosts) {
    const client = new Client({
      host,
      port: 5432,
      user,
      password,
      database,
    });
    try {
      await client.connect();
      console.log(`SUCCESS: ${user}:${password}@${host}/${database}`);
      await client.end();
      return;
    } catch (err) {
      console.log(`FAILED: ${user}:${password}@${host}/${database} - ${err.message}`);
    }
  }
}

probe();
