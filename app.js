import express from 'express';
import { getAllEvents } from './airtable.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("Welcome to CMU T&E"));

app.get('/events', (req, res) => getAllEvents(req, res));

app.listen(port, () => console.log(`App listening on port ${port}!`));