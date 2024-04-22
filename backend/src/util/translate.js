require('dotenv').config();
const { Translate } = require('@google-cloud/translate').v2;
const { getHash, getTranslations, storeTranslations } = require('./database');

const translate = new Translate();

/**
 * Get all supported languages of the Translation API.
 * 
 * @returns Array with all supported languages
 */
async function getLanguages() 
{
  const [languages] = await translate.getLanguages();

  return languages;
}

/**
 * Translate text.
 * 
 * Retrieves the translation from the database if the specified text was already translated 
 * else makes an API call to Translation API.
 * 
 * @param redis Valid redis client 
 * @param text Text which should be translated
 * @param target Desired target language for the translation
 * @returns Translations object containing translations and a flag if translations already exists 
 */
async function translateText(redis, text, target) 
{
  const hash = getHash(text, target);
  const existingTranslations = await getTranslations(redis, hash);

  if (existingTranslations) {
    return {
      'translations': existingTranslations,
      'existing': true
    };
  }

  let [translations] = await translate.translate(text, target);

  if (Array.isArray(translations)) {
    translations = translations.join('');
  }

  storeTranslations(redis, hash, translations);

  return {
    'translations': translations,
    'existing': false
  };
}

module.exports = { getLanguages, translateText };
