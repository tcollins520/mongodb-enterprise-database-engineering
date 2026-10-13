// Reference initialization for the lab's single-member data-shard replica set.
// Only use if shardRS is not already initialized.
rs.initiate({
  _id: "shardRS",
  members: [{ _id: 0, host: "192.168.56.111:27017" }]
});
