require('dotenv').config();
const { createClient } = require('redis');
const crypto = require('crypto');

/**
 * Connect to a redis database.
 * 
 * @returns Valid redis client
 */
async function getClient()
{
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;
    const user = process.env.REDIS_USER;
    const password = process.env.REDIS_PASSWORD;
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

/**
 * Get hash value of the combination of target and text.
 * Uses md5 as hash algorithm.
 * 
 * @param text The original text
 * @param target Code of target language
 * @returns Hash value
 */
function getHash(text, target)
{
    const value = target + text;
    const hash = crypto.createHash('md5').update(value).digest('hex');

    return hash;
}

/**
 * Store translations in database with a hash value as key.
 * 
 * @param client Valid redis client
 * @param hash Hash based on target and text used as key
 * @param translations The translation which should be stored
 */
async function storeTranslations(client, hash, translations)
{
    await client.set(hash, translations);
    console.log('Translations stored in database!');
}

/**
 * Get translations by key.
 * 
 * @param client Valid redis client
 * @param hash Hash based on target and text used as key
 * @returns Translations
 */
async function getTranslations(client, hash)
{
    const value = await client.get(hash);

    if (value) {
        console.log('Translations read from database!');
    }

    return value;
}

module.exports = { getClient, getHash, storeTranslations, getTranslations };
