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

// search for events based on a term from Marketing Request MASTER
// and Event Calendar tables and return to user
export function searchEvents(req, res) {
    var events = new Array();
    var term = req.query.search;
    newEventsBase('Marketing Requests MASTER').select()
    .eachPage(function page(records, fetchNextPage) {

        records.forEach(function(record) {
            if (searchNewEvents(term, record['fields'])) {
                events.push(record['fields']);
            }
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
                    if (searchOldEvents(term, record['fields'])) {
                        events.push(record['fields']);
                    }
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

export function searchNewEvents(term, event) {
    term = term.toUpperCase();

    return (event['Event Title'] != null && event['Event Title'].toUpperCase().includes(term)) ||
        (event['Event Type'] != null && event['Event Type'][0].toUpperCase().includes(term)) ||
        (event['Event Series'] != null && event['Event Series'].toUpperCase().includes(term)) ||
        (event['Event Description'] != null && event['Event Description'].toUpperCase().includes(term)) ||
        (event['Speaker Info'] != null && event['Speaker Info'].toUpperCase().includes(term)) ||
        (event['Audience'] != null && event['Audience'].toUpperCase().includes(term));
}

export function searchOldEvents(term, event) {
    term = term.toUpperCase();

    return (event['Name'] != null && event['Name'].toUpperCase().includes(term)) ||
        (event['Notes'] != null && event['Notes'].toUpperCase().include(term));
}
