const { Client } = require('pg');

async function createDb() {
    // We connect to the default 'postgres' database first to create our new one
    const client = new Client({
        connectionString: 'postgres://postgres:root@localhost:5432/postgres'
    });

    try {
        await client.connect();
        const res = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'products_catalog'");
        if (res.rowCount === 0) {
            console.log('Database products_catalog not found, creating...');
            await client.query('CREATE DATABASE products_catalog');
            console.log('Database products_catalog created successfully.');
        } else {
            console.log('Database products_catalog already exists.');
        }
    } catch (err) {
        console.error('Error creating database', err);
    } finally {
        await client.end();
    }
}

createDb();
