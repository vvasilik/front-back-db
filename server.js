import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConfigGET, configDelete, getConfigPOST } from './serverVariables.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/message', async (req, res) => {
    try {
        const { data } = await axios(getConfigGET())
            .catch(function (error) {
                console.log(`Error while sending data to DB: ${error.message}`);
            });
        res.send(JSON.stringify({ list: data?.document?.list }));
    } catch (error) {
        console.log(`Error while getting data from DB: ${error.message}`);
    }
});

app.post('/message', async (req, res) => {
    const list = req.body.list;
    const configPOST = getConfigPOST(list);
                
    await axios(configDelete)
        .then(function () {
            axios(configPOST)
                .then(() => {
                    res.send(JSON.stringify({ list }));
                })
                .catch(function (error) {
                    console.log(`Error while sending data to DB: ${error.message}`);
                    res.send(JSON.stringify({ list: [] }));
                });
        })
        .catch(function (error) {
            console.log(`Error while delete data from DB: ${error.message}`);
        });
});

app.listen(process.env.NODE_ENV === 'development' ? 3001 : (process.env.PORT || 3000));