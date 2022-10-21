import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from'body-parser';
import { getConfigGET, configDelete, getConfigPOST } from './serverVariables.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.post('/message', (req, res) => {
    const list = req.body.list;
    const configPOST = getConfigPOST(list);
                
    axios(configDelete)
        .then(function () {
            axios(configPOST)
                .catch(function (error) {
                    console.log(`Error while sending data to DB: ${error.message}`);
                });
        })
        .catch(function (error) {
            console.log(`Error while delete data from DB: ${error.message}`);
        });
    
    res.send(JSON.stringify({ list }));
});

app.listen(3001);