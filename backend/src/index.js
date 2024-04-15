const express = require('express');
const cors = require('cors');
const { getClient } = require('./util/database');
const { translateText, getLanguages } = require('./util/translate');

const app = express();

app.use(express.json());
app.use(cors());

async function startServer() {
    const redis = await getClient();

    app.get('/', function (req, res) {
        res.send({
            "status": "ok",
            "data": "Translation API is running!"
        });
    });

    app.get('/languages', async function (req, res) {
        try {
            const languages = await getLanguages();
            
            res.send({
                "status": "ok",
                "data": languages
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });

    app.post('/translate', async function (req, res) {
        const params = req.body;
        const text = params.text;
        const target = params.target;

        if (!text || !target) {
            res.status(400).send({
                "status": "error", 
                "error": 'Text or target isn\'t specified!'
            });

            return;
        }

        try {
            const translations = await translateText(redis, text, target);

            res.send({
                "status": "ok",
                "data": translations
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({
                "status": "error", 
                "error": 'Internal Server Error' 
            });
        }
    });

    app.listen(80, () => {
        console.log('Server is running on port 80');
    });
}

startServer();
