sh.status();
printjson(db.adminCommand({ listShards: 1 }));
printjson(db.adminCommand({ balancerStatus: 1 }));
const events = db.getSiblingDB("labdb").events;
print("events count: " + events.countDocuments());
printjson(events.find().limit(10).toArray());
printjson(events.find({ eventId: 1 }).explain("executionStats"));
