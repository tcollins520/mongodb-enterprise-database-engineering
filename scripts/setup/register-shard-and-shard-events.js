// Connect to mongos on shard-router1 after cfgRS and shardRS are healthy.
sh.addShard("shardRS/192.168.56.111:27017");
sh.status();
db.adminCommand({ listShards: 1 });

sh.enableSharding("labdb");
sh.shardCollection("labdb.events", { eventId: 1 });

// Use a small synthetic test set only if the collection does not already
// contain the intended five records; inspect before inserting to avoid duplicates.
db.getSiblingDB("labdb").events.countDocuments();
db.getSiblingDB("labdb").events.find().limit(10);
