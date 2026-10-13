printjson(rs.status());
printjson(rs.conf());
printjson(db.hello());
printjson(rs.status().members.map(m => ({
  name: m.name,
  state: m.stateStr,
  health: m.health
})));
printjson(db.adminCommand({ getCmdLineOpts: 1 }).parsed.replication);
