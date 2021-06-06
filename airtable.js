import airtable from "airtable";

var base = new airtable({apiKey: process.env.API_KEY}).base(process.env.API_BASE);

export function getAllEvents(req, res) {
    var events = new Array();
    base('Event Calendar').select({
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
