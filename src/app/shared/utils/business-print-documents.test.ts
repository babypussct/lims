import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSampleHandoverDocument, buildSopConfigDocument, buildTraceDocument } from './business-print-documents';

test('SOP guide retains revision and expressions and describes missing procedure data', () => {
  const doc = buildSopConfigDocument({id:'S1',name:'SOP thử',category:'Hóa',version:3,inputs:[],variables:{total:'n * 2'},consumables:[{name:'HC',formula:'total',unit:'mL',type:'simple'}]});
  assert.match(doc.subtitle,/v3/);
  assert.match(doc.notice,/đối chiếu SOP đã ban hành/);
  assert.deepEqual(doc.sections.find(section=>section.title==='Công thức cấu hình')!.rows[0].cells,['total','n * 2']);
});
test('handover keeps assigned targets and leaves acceptance data for actual handover', () => {
  const doc = buildSampleHandoverDocument({id:'R1',sopId:'S1',sopName:'SOP thử',status:'pending',timestamp:new Date(),items:[],sampleList:[' a001 '],sampleTargetMap:{A001:['T1']},targetNames:{T1:'Chỉ tiêu 1'}});
  assert.deepEqual(doc.sections[1].rows[0].cells,[' a001 ','Chưa có mô tả','Chỉ tiêu 1','________________']);
  assert.match(doc.notice,/chưa xác nhận đã tiếp nhận/);
});
test('trace print retains visible timeline metadata and marks partially loaded history', () => {
  const doc = buildTraceDocument('LOG1',[],[{id:'L1',title:'Dùng chuẩn',actorName:'KNV',icon:'fa-flask',status:'info',metadata:[{label:'Lượng',value:'2 mg'}]}],['Thiếu thiết bị'],true);
  assert.match(doc.notice,/Còn dữ liệu chưa tải/);
  assert.equal(doc.sections[0].rows[0].key,'L1');
  assert.match(doc.sections[0].rows[0].cells[2],/2 mg/);
});
