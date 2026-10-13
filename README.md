# MongoDB Enterprise Database Platform Engineering

A portfolio-grade **NoSQL database engineering** project covering MongoDB Enterprise 8.0 administration, security, backup/restore, monitoring, data interchange, replica-set architecture, and a working sharded-cluster lab. The project uses CentOS Stream 9 and small, resource-constrained virtual machines to practice database operations with verifiable command-line checks. The GitHub repository is intended to emphasize the project's **MongoDB scripts, configuration examples, validation commands, and technical documentation**; infrastructure provisioning files are supporting material rather than the focus.

> **Project status:** Standalone administration, CRUD/query operations, aggregation, indexing, access control, backup/restore, monitoring, and JSON/CSV interchange are complete. The sharded-cluster lab is also implemented: the three-member config-server replica set is healthy, the single-member data shard is active, `mongos` is running, authentication has been verified, and `labdb.events` is sharded. Replica-set operational drills and further sharding validation/documentation remain possible enhancements.

## Project overview

This repository documents the design, implementation, validation, and operational practices of a MongoDB Enterprise NoSQL data platform on a reproducible local infrastructure environment. MongoDB stores records as BSON documents, a binary representation of JSON-like data, which supports nested objects, arrays, and flexible document structures. This makes it useful for semi-structured application data and data whose fields can evolve over time; it can also store content that does not fit neatly into fixed relational rows, while still requiring deliberate schema design and validation. The project emphasizes command-line implementation, validation, operational safety, and documentation of observed results.

The current implementation uses small datasets and resource-constrained virtual machines to make the environment reproducible on a developer workstation. The architecture documents which components are suitable for production patterns and which topology choices are constrained demonstrations.

## NoSQL and data-modeling focus

MongoDB is a document-oriented NoSQL database. Rather than requiring every record to fit a single fixed relational table structure, collections can contain BSON documents with nested fields and arrays. This flexibility is useful for semi-structured data such as application events, product catalogs, content metadata, and evolving application records. Unstructured content—such as text or media—can also be represented or referenced in MongoDB, but storing it effectively still depends on choosing an appropriate document model and storage approach.

This project demonstrates the operational side of working with document data: querying nested or varying fields, aggregating documents, indexing query patterns, controlling access, and moving data through JSON/CSV interchange and BSON-based backup/restore. The included `ai_ml` collection provides sample topic-oriented documents; it is a small practice dataset, not a production data workload.

## Engineering objectives

- Explain MongoDB's NoSQL document model and how BSON documents support flexible, semi-structured data.
- Install and validate MongoDB Enterprise on CentOS Stream 9 ARM64.
- Practice document CRUD, filtering, projections, sorting, and updates in `mongosh`.
- Build aggregation pipelines and interpret their results.
- Create and evaluate single-field, compound, and multikey indexes using `explain("executionStats")`.
- Configure authentication and role-based access, including a custom read-only role.
- Back up and restore data with `mongodump` and `mongorestore`.
- Inspect server status, current operations, connections, logs, memory, disk, and service health.
- Export and import JSON/CSV with `mongoexport` and `mongoimport`, including filtered exports, duplicate-key behavior, and upserts.
- Understand the roles of a config-server replica set, shard replica set, and `mongos` query router.
- Configure inter-node authentication and validate authenticated access.
- Enable sharding for a test database and shard a collection using a ranged shard key.
- Inspect shard membership and document the limitations of a one-data-shard demonstration.

## Architecture

### Current standalone deployment

| Component | Current configuration |
|---|---|
| Host | Apple Silicon MacBook Air, 16 GB RAM |
| Virtualization | Vagrant 2.4.9 and VirtualBox 7.2.20 |
| Guest OS | CentOS Stream 9, ARM64 |
| VM | `mongo-cs1` |
| Private IP | `192.168.56.10` |
| VM resources | 1 vCPU, 1 GB RAM |
| Database | MongoDB Enterprise 8.0.32 |
| Shell | `mongosh` 2.13.0 |
| MongoDB Database Tools | 100.19.1 |
| Listener | `127.0.0.1:27017` |
| Authorization | Enabled |

MongoDB currently listens on loopback only. Network binding will be revisited as part of the secured replica-set implementation.

### Planned replica-set topology

| Member | Planned IP | Status |
|---|---|---|
| `mongo-cs1` | `192.168.56.10` | Existing standalone VM; preserve its data |
| `mongo-cs2` | `192.168.56.11` | Planned; inspect Vagrant state before creating |
| `mongo-cs3` | `192.168.56.12` | Planned; inspect Vagrant state before creating |

The planned replica-set name is `rs0`. The replica project is maintained separately under `~/Documents/mongodb-replica-lab`. Its Vagrantfile was validated previously, but current VM status must be checked before proceeding.

### Implemented sharded-cluster lab

The five-VM lab is running on CentOS Stream 9 with MongoDB Enterprise 8.0.32. The role/IP assignments below reflect the implemented lab:

| VM | Role | Private IP | Verified state |
|---|---|---|---|
| `shard-cfg1` | Config server, `cfgRS` | `192.168.56.101` | PRIMARY |
| `shard-cfg2` | Config server, `cfgRS` | `192.168.56.102` | SECONDARY |
| `shard-cfg3` | Config server, `cfgRS` | `192.168.56.103` | SECONDARY |
| `shard-data1` | Data shard, `shardRS` | `192.168.56.111` | Single-member PRIMARY |
| `shard-router1` | `mongos` query router | `192.168.56.121` | Service active/enabled |

The config-server replica set has three healthy members. The data shard currently contains one member, so this is a functional sharding configuration exercise—not a highly available shard design. A single data shard cannot demonstrate data distribution across multiple shards or shard-level redundancy. The custom `mongos` systemd unit is used because the installed package did not provide a service unit for the router.

## Implementation status

| Phase | Status | Summary |
|---|---|---|
| 1. CentOS and MongoDB installation | Complete | CentOS Stream 9 ARM64 VM with MongoDB Enterprise 8.0.32 |
| 2. CRUD and query operations | Complete | Inserts, reads, filters, projections, updates, and related operations |
| 3. Aggregation | Complete | `$match`, `$group`, `$sum`, `$project`, `$unwind`, `$sort`, `$limit` |
| 4. Indexing and query plans | Complete | Single-field, compound, and multikey indexes; IXSCAN, COLLSCAN, covered query |
| 5. Authentication and roles | Complete | Admin user, application reader, custom movie read-only role |
| 6. Backup and restore | Complete | `mongodump`, namespace-remapped `mongorestore`, count and index validation |
| 7. Monitoring and OS checks | Complete | `serverStatus`, `currentOp`, connections, logs, memory, disk, CPU, service health |
| 8. Swappiness tuning | Complete | Persistent `vm.swappiness = 1` |
| 9. JSON/CSV export and import | Complete | Full exports, selected fields, filtered export, duplicate-key behavior, upsert |
| 10. Three-member config-server replica set | Complete | `cfgRS` reports one PRIMARY and two SECONDARY members |
| 11. Shard and router services | Complete | Single-member `shardRS`; `mongos` active and enabled |
| 12. Authentication and sharded collection | Complete | Internal authentication verified; `labdb.events` sharded on `{ eventId: 1 }` |
| 13. Final sharding evidence | In progress | Add query-targeting/explain evidence and capture final validation outputs |

## Data used in the project

The `mymongodb` database includes these collections:

| Collection | Verified document count | Purpose |
|---|---:|---|
| `movies` | 5 | CRUD, export/import, and query exercises |
| `ai_ml` | 13 | Aggregation, index, and query-plan exercises |
| `cappedCollection` | 0 | Capped collection demonstration |
| `test` | 1 | Basic connectivity/application test |
| `users` | 1 | User/document exercise |

The `ai_ml` dataset covers Python, NumPy, pandas, machine learning, LLMs, embeddings, vector databases, RAG, AI agents, evaluation, prompt engineering, fine-tuning, and model monitoring.

The export/import exercises created a separate database, `mymongodb_import_test`, with:
- `movies_json_import`: 5 documents
- `movies_csv_import`: 5 documents
- `movies_upsert_test`: 5 documents

A restore validation database, `mymongodb_restore_test`, was also created. These test databases are intentionally retained; the README does not instruct users to drop them.

## Key implementation highlights

### CRUD and query practice

Practiced inserts, finds, projections, comparison operators, `$in`, `$and`, `$or`, `$ne`, sorting, limits, counts, field existence, regular expressions, `$set`, `$inc`, `$addToSet`, `$push`, `$unset`, `updateMany`, `replaceOne`, and `deleteOne`.

### Aggregation and indexing

Aggregation exercises grouped `ai_ml` documents by level, producing 4 Beginner, 6 Intermediate, and 3 Advanced documents. Indexing exercises compared indexed and unindexed query plans, tested a compound index's prefix behavior, used a multikey index, and demonstrated a covered query.

### Security

Authorization is enabled. The project includes:
- `projectAdmin` in `admin`, with administrative roles for the project.
- `appReader` in `mymongodb`, using the built-in `read` role.
- `movieReadOnlyCustom`, a custom role granting `find` on `mymongodb.movies`.
- `movieAnalyst`, restricted to the custom movie-read role.

Permission checks confirmed that read access works where granted and writes or unrelated collection reads are denied where not granted.

### Backup and restore

A `mongodump` backup was restored into `mymongodb_restore_test` with namespace remapping. Counts were checked for the restored collections and indexes were verified.

Known project backup location (inside the VM):

```text
/home/dba/mongodb-backups/backup-20261011-210706/
```

This is a machine-local path, not a file committed to the repository. Do not commit database backups, credentials, or private key material.

### Monitoring and host tuning

The project inspected connection statistics, current operations, memory, operation counters, network statistics, uptime, MongoDB logs, system memory, swap, CPU load, disk capacity, service status, and listener addresses. A persistent swappiness setting was applied:

```text
/etc/sysctl.d/99-mongodb-project.conf
vm.swappiness = 1
```

A separate MongoDB startup warning mentioned a sysfs setting; its exact path/value must be rechecked in current logs before making any further kernel changes.

### JSON and CSV interchange

The export/import project verified:
- JSON export preserved `_id` values and exported document fields.
- CSV export included only selected fields (`title`, `year`, `genre`, `rating`).
- CSV import generated new `_id` values, omitted `director`, and imported `year` as `int` and `rating` as `double`.
- Filtered JSON export selected the three Sci-Fi movies.
- Re-importing JSON into a collection with the same `_id` values produced `E11000` duplicate-key errors.
- `--mode=upsert --upsertFields=_id` handled repeat imports without duplicate-key failures.

`mongoexport` and `mongoimport` are used for data interchange; they are not substitutes for `mongodump` and `mongorestore`.

## Repository layout

The repository should foreground reusable database scripts, safe configuration examples, and validation evidence. Adjust the tree to match files actually committed; the layout below is a recommended organization, not a claim that every path already exists.

```text
mongodb-enterprise-centos-dba-platform/
├── README.md
├── configs/
│   ├── mongod/
│   ├── mongos/
│    └── replica-set/
├── scripts/
│   ├── install/                  # package/repository setup helpers
│   ├── security/                 # users, roles, keyFile setup guidance
│   ├── setup/                    # replica-set and sharding commands
│   ├── backup-restore/
│   ├── export-import/
│   ├── monitoring/
│   └── validation/               # service, topology, auth, sharding checks
├── docs/
│   ├── runbook.md
│   ├── architecture/
│   │   ├── standalone.md
│   │   └── sharded-cluster.md
│   └── validation/
└── .gitignore
```

Keep Vagrantfiles or other provisioning assets only if they are useful to reproduce the environment; they are not the central deliverable. Commit scripts and sanitized configuration examples that correspond to the actual lab. Never commit a live keyFile, passwords, raw secret output, database dumps, or machine-specific credentials.

## Getting started

This repository is primarily a record of MongoDB configuration, administration scripts, and validation procedures. Review each script and configuration example before running it: addresses, service names, authentication options, and paths may need to be adapted to your own lab.

### Host and lab prerequisites

- CentOS Stream 9 nodes with compatible MongoDB Enterprise 8.0 packages.
- Private network connectivity among config servers, shard members, and the `mongos` router.
- MongoDB Enterprise entitlement/evaluation appropriate for your use.
- A shared internal-authentication keyFile deployed securely to the relevant MongoDB processes. The real keyFile must remain outside Git.

### Connect and validate

Connect to the router using the lab's configured address and an authorized user. Supply the password interactively rather than storing it in shell history:

```bash
mongosh --host 192.168.56.121 --port 27017 \
  --username labAdmin --authenticationDatabase admin --password
```

Then run read-only topology checks from `mongosh`:

```javascript
sh.status()
 db.adminCommand({ listShards: 1 })
 db.getSiblingDB("labdb").events.countDocuments()
```

### 1. Complete sharding evidence

- Capture sanitized output from `rs.status()` for `cfgRS` and `shardRS`.
- Capture `sh.status()`, `listShards`, and `getShardDistribution()` output for `labdb.events`.
- Run a representative query with `explain("executionStats")` and document what the output does—and does not—prove with only one data shard.
- Record balancer status and the shard-key rationale.

### 2. Operational and recovery checks

- Verify service state, listeners, logs, memory, and disk usage on all five VMs.
- Document safe restart/recovery procedures for config-server members and the router.
- Consider a multi-member data-shard replica set as a future extension; do not describe the current single-member shard as redundant or highly available.
- Preserve the existing lab data and inspect targets before any destructive operation.

## Validation snapshot

Verified project results (standalone exercises recorded October 11, 2026; sharded-cluster state recorded October 13, 2026):
- Standalone MongoDB Enterprise 8.0.32 active on `mongo-cs1`, with authorization enabled and listener bound to `127.0.0.1:27017`.
- Original `mymongodb.movies` collection contains 5 documents; `mymongodb.ai_ml` contains 13 documents.
- JSON, CSV, and upsert test collections each contain 5 documents.
- `mymongodb_restore_test` contains restored data with matching collection counts and verified indexes.
- Config-server replica set `cfgRS` has one PRIMARY and two SECONDARY members.
- Data-shard replica set `shardRS` has one PRIMARY member; `mongos` is active/enabled.
- `labdb.events` is sharded using the ranged shard key `{ eventId: 1 }` and contains 5 documents.
- The sharded lab has only one data shard; cross-shard distribution and data-shard redundancy have not been demonstrated.