import airtable from "airtable";

var pastEventsBase = new airtable({apiKey: process.env.API_KEY}).base(process.env.API_PAST_EVENTS_BASE);
var newEventsBase = new airtable({apiKey: process.env.API_KEY}).base(process.env.API_NEW_EVENTS_BASE);

export function getPastEvents(req, res) {
    var events = new Array();
    pastEventsBase('Event Calendar').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {
            events.push(record['fields']);
        });
    
        fetchNextPage();
    
    }, function done(err) {
        if (err) { 
            console.error(err); 
            return; 
        } else {
            res.json(events);
        }
    });
}

export function getNewEvents(req, res) {
    var events = new Array();
    newEventsBase('Marketing Requests MASTER').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function(record) {
            events.push(record['fields']);
        });
    
        fetchNextPage();
    
    }, function done(err) {
        if (err) { 
            console.error(err); 
            return; 
        } else {
            res.json(events);
        }
    });
}