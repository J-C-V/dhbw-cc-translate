require('dotenv').config();
const { getHash, getTranslations, storeTranslations } = require('./database');
const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate();

async function getLanguages() 
{
  const [languages] = await translate.getLanguages();

  return languages;
}

async function translateText(client, text, target) 
{
  const hash = getHash(text, target);
  const existingTranslations = await getTranslations(client, hash);

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

  storeTranslations(client, hash, translations);

  return {
    'translations': translations,
    'existing': false
  };
}

module.exports = { getLanguages, translateText };
