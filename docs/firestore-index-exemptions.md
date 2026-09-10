# Firestore index configuration and rollout

The checked-in composite indexes preserve the existing production queries. Do not deploy a reduced list without checking the live index configuration first: a deployment may otherwise propose deleting indexes still used by clients.

## Payload fields excluded from automatic indexing

| Collection group | Field | Reader/writer evidence |
|---|---|---|
| `print_jobs` | `sop`, `inputs`, `items` | State service stores immutable print snapshots. Audit log, print queue and traceability read documents by ID. |
| `results_details` | `resultData`, `page1Data` | Result service stores result grids; result list fetches details by document ID. |
| `history` | `resultDataBackup`, `page1DataBackup` | Result service archives published grids. History queries order by `version`, then read the backup payload from returned documents. |
| `logs` | `printData` | Legacy print snapshot loaded after activity queries; filtering uses audience, actor, timestamp and other indexed metadata. |
| `requests` | `inputs`, `targetScopeSnapshots` | Batch input/target snapshots read with the request. Date/status queries use separate top-level fields. |

The application query call sites were reviewed across `src`, `api`, `scripts`, and `gas`. No current query filters or orders by these payload fields or their children. These exemptions do not remove document data, change authorization, disable document-ID lookup, or remove the metadata fields used in composite indexes.

Map-field exemptions apply to nested fields. A future feature that needs a server query on a child of an excluded map must add an explicit index and verify it before rollout. Do not use the map itself as an indexed query field without reviewing the exemption.

Sources: [Firestore index overview](https://firebase.google.com/docs/firestore/query-data/index-overview), [large array/map indexing guidance](https://firebase.google.com/docs/firestore/best-practices).

## Release procedure

1. Follow `DEPLOYMENT.md`: release metadata, full verification, commit, prepush and push.
2. Run `npm run deploy:indexes` from the pushed commit. Non-interactive deployment must fail rather than silently accept unexpected removal of composite indexes.
3. Verify the live composite index set still matches the committed definitions, and each field override reports an empty index list.
4. Smoke-test Dashboard, Results, print previews/history and traceability using existing authorized data. Do not create, delete or republish laboratory records merely to test index exemptions.
5. Recheck `storage/data_and_index_storage_bytes` after the service has applied the configuration and Monitoring has caught up. An accepted deployment alone does not prove a specific storage reduction.

## Rollback

Restore the previous field overrides from Git and deploy indexes using the same gates. Re-enabling indexing can require build time and additional storage; verify index readiness before introducing queries that rely on those fields. Composite indexes should remain intact throughout rollback.
