import airtable from "airtable";

var pastEventsBase = new airtable({apiKey: process.env.API_KEY}).base(process.env.API_PAST_EVENTS_BASE);
var newEventsBase = new airtable({apiKey: process.env.API_KEY}).base(process.env.API_NEW_EVENTS_BASE);

// get all event from Event Calendar table and return to user
export function getPastEvents(req, res) {
    var events = new Array();
    pastEventsBase('Event Calendar').select()
    .eachPage(function page(records, fetchNextPage) {
    
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

// get all events from Marketing Request MASTER table and return to user
export function getNewEvents(req, res) {
    var events = new Array();
    newEventsBase('Marketing Requests MASTER').select()
    .eachPage(function page(records, fetchNextPage) {

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

// get all events from Marketing Request MASTER table and 
// Event Calendar table and return to user
export function getAllEvents(req, res) {
    var events = new Array();
    newEventsBase('Marketing Requests MASTER').select()
    .eachPage(function page(records, fetchNextPage) {

        records.forEach(function(record) {
            events.push(record['fields']);
        });
    
        fetchNextPage();
    
    }, function done(err) {
        if (err) { 
            console.error(err); 
            return; 
        } else {
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
    });
}

// filter events from Marketing Request MASTER by event series
// and return to user
export function eventSeries(req, res) {
    var events = new Array();
    var eventSerie = req.query.eventSerie;
    newEventsBase('Marketing Requests MASTER').select({
        view: "Grid view",
        filterByFormula: `{Event Series} = '${eventSerie}'`
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
