const { getClient } = require('database');
const { translateText, getLanguages } = require('translate');
const ErrorResponse = require('../classes/ErrorResponse');
const SuccessResponse = require('../classes/SuccessResponse');

/**
 * Init routes and route logic.
 */
async function initRouter()
{
    const redis = await getClient();

    app.get('/', function (req, res) {
        res.json(new SuccessResponse('Translation API is running!'));
    });

    app.get('/languages', async function (req, res) {
        try {
            const languages = await getLanguages();

            res.json(new SuccessResponse(languages));
        } catch (error) {
            console.error('Error: ', error);

            res.status(500).json(new ErrorResponse('Internal Server Error'));
        }
    });

    app.post('/translate', async function (req, res) {
        const text = req.body.text;
        const target = req.body.target;

        if (!text || !target) {
            res.status(400).json(new ErrorResponse("Text or target isn't specified!"));

            return;
        }

        try {
            const translations = await translateText(redis, text, target);

            res.json(new SuccessResponse(translations));
        } catch (error) {
            console.error('Error: ', error);

            res.status(500).json(new ErrorResponse('Internal Server Error'));
        }
    });
}

module.exports = initRouter;
