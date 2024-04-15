const { createClient } = require('redis');
const crypto = require('crypto');

async function getClient()
{
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    let auth = '';

    if (user && password) {
        auth = user + ':' + password
    }

    const client = createClient({
        url: 'redis://' + auth + '@' + host + ':' + port
    });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    return client;
}

function getHash(text, target)
{
    const value = target + text;
    const hash = crypto.createHash('md5').update(value).digest('hex');

    return hash;
}

async function storeTranslations(client, hash, translations)
{
    await client.set(hash, translations);
    console.log('Translations stored in database!');
}

async function getTranslations(client, hash)
{
    const value = await client.get(hash);

    if (value) {
        console.log('Translations read from database!');
    }

    return value;
}

module.exports = { getClient, getHash, storeTranslations, getTranslations };
