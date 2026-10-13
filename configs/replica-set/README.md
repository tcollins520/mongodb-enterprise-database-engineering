# Replica-set configuration notes

`mongo-cs1-mongod.conf`, `mongo-cs2-mongod.conf`, and `mongo-cs3-mongod.conf`
are reference configurations for the final `rs0` state. Preserve each VM's
existing `systemLog`, `storage`, and `processManagement` settings when merging.

The verified member state in the project notes was:
- `192.168.56.10:27017` SECONDARY
- `192.168.56.11:27017` PRIMARY
- `192.168.56.12:27017` SECONDARY
- all members `health: 1`

Do not replace an active config without backing it up and reviewing the diff.
