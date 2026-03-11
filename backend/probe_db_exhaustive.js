const { Client } = require('pg');

async function probe() {
  const users = ['postgres', 'user', 'admin', 'root'];
  const passwords = ['password', 'postgres', 'admin', 'root', '', '123456'];
  const databases = ['orion_db', 'postgres', 'test'];

  for (const user of users) {
    for (const password of passwords) {
      for (const database of databases) {
        const client = new Client({
          host: 'localhost',
          port: 5432,
          user,
          password,
          database,
        });
        try {
          await client.connect();
          console.log(`SUCCESS: ${user}:${password}@localhost/${database}`);
          await client.end();
          return;
        } catch (err) {
          // console.log(`FAILED: ${user}:${password}@localhost/${database} - ${err.message}`);
        }
      }
    }
  }
  console.log('No valid combination found.');
}

probe();
