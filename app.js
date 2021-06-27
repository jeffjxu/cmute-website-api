import express from 'express';
import bodyParser from 'body-parser';

import { 
    getPastEvents,
    getNewEvents,
    getAllEvents,
    eventSeries, 
    searchEvents
} from './airtable.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Welcome to CMU T&E"));

app.get('/events', (req, res) => getAllEvents(req, res));

app.get('/pastEvents', (req, res) => getPastEvents(req, res));

app.get('/newEvents', (req, res) => getNewEvents(req, res));

app.get('/eventSeries', (req, res) => eventSeries(req, res));

app.get('/search', (req, res) => searchEvents(req, res));

app.listen(port, () => console.log(`App listening on port ${port}!`));