// Run exactly once, connected to the intended replica-set node, after all three
// nodes have matching replSetName/keyFile configuration and can reach each other.
// Check rs.status() first; do not re-run blindly on an initialized set.
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "192.168.56.10:27017" },
    { _id: 1, host: "192.168.56.11:27017" },
    { _id: 2, host: "192.168.56.12:27017" }
  ]
});
