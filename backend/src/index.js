const express = require('express');
const cors = require('cors');
const initRouter = require('./util/router');

const app = express();

app.use(cors());
app.use(express.json());

initRouter(app);

app.listen(80, () => {
    console.log('Server is running on port 80');
});
