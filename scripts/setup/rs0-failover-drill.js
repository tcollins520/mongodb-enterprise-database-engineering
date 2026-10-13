// Controlled exercise only. Run manually on the current PRIMARY after
// confirming all members are healthy and approving a 60-second stepdown.
// This file is a reference, not an automatic end-to-end failover test.

rs.stepDown(60);

// After the election, connect to the new PRIMARY and run this write test.
const testDb = db.getSiblingDB("mymongodb");
testDb.replica_failover_test.insertOne({
  test: "primary_failover",
  createdAt: new Date(),
  primaryAtInsert: "192.168.56.11:27017"
});

// Verify replication from both secondaries before cleanup.
// Only after verifying the test document, run this separately if approved:
// db.getSiblingDB("mymongodb").replica_failover_test.drop();
