/** Read-only production audit. Reuses Firebase CLI login; never persists credentials or document contents. */
const fs = require('node:fs');
const path = require('node:path');
const auth = require('firebase-tools/lib/auth');
const { requireAuth } = require('firebase-tools/lib/requireAuth');
const api = require('firebase-tools/lib/apiv2');
const PROJECT = 'lims-cloud-by-otada';
const OUT = path.resolve('artifacts/spark-audit-2026-09-09');
const DB = `projects/${PROJECT}/databases/(default)`;
const START = '2026-08-25T07:00:00Z'; // Pacific midnight; quota reset timezone.
const END = new Date(Math.floor(Date.now() / 3600000) * 3600000).toISOString();
let token;
async function request(url, body) {
  const r = await fetch(url, { method: body ? 'POST' : 'GET', headers: {Authorization: `Bearer ${token}`, 'Content-Type':'application/json'}, ...(body ? {body:JSON.stringify(body)} : {}) });
  const j = await r.json();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${j.error?.status || 'request failed'}`);
  return j;
}
function save(name, value) { fs.writeFileSync(path.join(OUT,name), JSON.stringify(value,null,2)); }
async function metric(type, kind='DELTA') {
 const params = new URLSearchParams({filter:`metric.type="firestore.googleapis.com/${type}"`, 'interval.startTime':START,'interval.endTime':END, 'aggregation.alignmentPeriod':'3600s', 'aggregation.perSeriesAligner':kind==='DELTA'?'ALIGN_SUM':'ALIGN_MAX', pageSize:'100000'});
 let series=[];
 do { const j=await request(`https://monitoring.googleapis.com/v3/projects/${PROJECT}/timeSeries?${params}`); series.push(...j.timeSeries||[]); if(!j.nextPageToken) break; params.set('pageToken',j.nextPageToken); } while(true);
 save(type.replaceAll('/','-')+'.json',{start:START,end:END,series});
 console.log(type,series.length,'series',series.reduce((n,s)=>n+(s.points?.length||0),0),'points');
}
async function main(){
 fs.mkdirSync(OUT,{recursive:true});
 await requireAuth({...auth.getGlobalDefaultAccount(),project:PROJECT}); token=await api.getAccessToken();
 const b=await request(`https://cloudbilling.googleapis.com/v1/projects/${PROJECT}/billingInfo`); save('billing.json',{projectId:PROJECT,billingEnabled:b.billingEnabled,observedAt:END});
 save('database.json',await request(`https://firestore.googleapis.com/v1/${DB}`));
 for(const [name,kind] of [['rules/evaluation_count'],['api/request_count'],['document/read_ops_count'],['document/write_ops_count'],['document/delete_ops_count'],['document/read_count'],['document/write_count'],['document/delete_count'],['network/active_connections','GAUGE'],['network/snapshot_listeners','GAUGE'],['storage/data_and_index_storage_bytes','GAUGE'],['storage/backups_storage_bytes','GAUGE'],['storage/pitr_storage_bytes','GAUGE']]) {try{await metric(name,kind);}catch(e){save(name.replaceAll('/','-')+'.json',{error:e.message});console.log(name,e.message);}}
 if (process.argv.includes('--metrics-only')) return;
 const root=`https://firestore.googleapis.com/v1/${DB}/documents`;
 const parents=['', '/artifacts/lims-cloud-fixed']; const counts=[];
 for(const parent of parents){
  let ids=[],pageToken;
  do {const j=await request(root+parent+':listCollectionIds',{pageSize:1000,...(pageToken?{pageToken}:{})});ids.push(...j.collectionIds||[]);pageToken=j.nextPageToken;}while(pageToken);
  for(const id of ids){
   const j=await request(root+parent+':runAggregationQuery',{structuredAggregationQuery:{structuredQuery:{from:[{collectionId:id}]},aggregations:[{alias:'total',count:{}}]}});
   const count=Number(j.find(x=>x.result)?.result.aggregateFields.total.integerValue||0);
   counts.push({path:parent+'/'+id,count,readTime:j.find(x=>x.readTime)?.readTime}); console.log('count',parent+'/'+id,count);
  }
 }
 // Whole-database group counts cover nested history/logs (including missing parent documents).
 const groups=[...new Set([...counts.map(x=>x.path.split('/').at(-1)), 'history'])];
 const groupCounts=[];
 for(const id of groups){const j=await request(root+':runAggregationQuery',{structuredAggregationQuery:{structuredQuery:{from:[{collectionId:id,allDescendants:true}]},aggregations:[{alias:'total',count:{}}]}});groupCounts.push({collectionGroup:id,count:Number(j.find(x=>x.result)?.result.aggregateFields.total.integerValue||0)});}
 save('collection-counts.json',{observedAt:END,counts,groupCounts,scope:'Root and lims-cloud-fixed collections discovered; group counts include nested documents for these IDs and known history. Unknown nested collection IDs are not automatically discovered.'});
 save('run.json',{project:PROJECT,startedAt:END,completedAt:new Date().toISOString(),mode:'read-only',documentContentsSaved:false});
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
