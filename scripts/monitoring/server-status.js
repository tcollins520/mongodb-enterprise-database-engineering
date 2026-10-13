const s = db.adminCommand({ serverStatus: 1 });
printjson({
  connections: s.connections,
  mem: s.mem,
  opcounters: s.opcounters,
  network: s.network,
  uptime: s.uptime
});
printjson(db.currentOp());
