const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const FIELD_NAME = "messageField";
const DEFAULT_CONFIG = {
    "collection": "numberCollection",
    "database": "numberDB",
    "dataSource": "Cluster0",
}

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': '5FRvEylo6N9H5lHuxTeUW3yIfkUd1dOqv1166uBZj8Wm5TGRr4fQNRHERsgjKeQX',
}

const urlDB = "https://data.mongodb-api.com/app/data-wbtfr/endpoint/data/v1";

const configDelete = {
    method: 'post',
    url: `${urlDB}/action/deleteOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "filter": { "name": FIELD_NAME }
    }),
};

const getConfigPOST = (message) => ({
    method: 'post',
    url: `${urlDB}/action/insertOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "document": {
            "name": FIELD_NAME,
            "message": message
        }
    }),
});

const getConfigGET = () => ({
    method: 'post',
    url: `${urlDB}/action/findOne`,
    headers,
    data: JSON.stringify({
        ...DEFAULT_CONFIG,
        "filter": { "name": FIELD_NAME }
    }),
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/message', async (req, res) => {
    try {
        const { data } = await axios(getConfigGET())
            .catch(function (error) {
                console.log(`Error while sending data to DB: ${error.message}`);
            });
        res.send(JSON.stringify({ message: data?.document?.message }));
    } catch (error) {
        console.log(`Error while getting data from DB: ${error.message}`);
    }
});

app.post('/message', (req, res) => {
    const message = req.body.message;
    console.log(`Set message to ${message}`);
                
    axios(configDelete)
        .then(function () {
            axios(getConfigPOST(req.body.message))
                .catch(function (error) {
                    console.log(`Error while sending data to DB: ${error.message}`);
                });
        })
        .catch(function (error) {
            console.log(`Error while delete data from DB: ${error.message}`);
        });
    
    res.send(JSON.stringify({ message }));
});

app.listen(3001);