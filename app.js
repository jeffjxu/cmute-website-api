import express from 'express';
import { getPastEvents, getNewEvents } from './airtable.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Welcome to CMU T&E"));

app.get('/events', (req, res) => getPastEvents(req, res));

app.get('/newEvents', (req, res) => getNewEvents(req, res));

app.listen(port, () => console.log(`App listening on port ${port}!`));