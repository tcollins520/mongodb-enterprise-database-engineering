// Reference initialization for the three config servers.
// Only use if cfgRS is not already initialized; verify sh.status() first.
rs.initiate({
  _id: "cfgRS",
  configsvr: true,
  members: [
    { _id: 0, host: "192.168.56.101:27017" },
    { _id: 1, host: "192.168.56.102:27017" },
    { _id: 2, host: "192.168.56.103:27017" }
  ]
});
