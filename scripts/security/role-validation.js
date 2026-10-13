// Run in mongosh as an appropriately privileged administrator.
db.runCommand({ connectionStatus: 1 });
db.getSiblingDB("admin").getUser("labAdmin");
db.getSiblingDB("mymongodb").getUser("appReader", { showPrivileges: true });
db.getSiblingDB("mymongodb").getUser("movieAnalyst", { showPrivileges: true });
db.getSiblingDB("mymongodb").getRole("movieReadOnlyCustom", { showPrivileges: true });
