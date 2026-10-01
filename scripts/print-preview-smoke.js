/* Local browser QA with synthetic data; no Firebase/Drive account or writes. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function main() {
  const repo = path.resolve(__dirname, '..');
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'lims-print-smoke-'));
  console.log('Artifacts:', output);
  const compiled = path.join(output, 'compiled');
  // Compile signal inputs/outputs with Angular, as the application build does.
  execFileSync(process.execPath, [path.join(repo, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
    '-p', path.join(repo, 'tsconfig.app.json'), '--outDir', compiled], { stdio: 'pipe' });
  const serviceMocks = {
    'state.service': `import { Injectable, signal } from '@angular/core'; @Injectable({providedIn:'root'}) export class StateService { printConfig=signal({showSignature:true,footerText:'Phiếu thử nghiệm bố cục'}); sops=signal([]); isAdmin=signal(false); ensureApprovedRequestsListener(){} approvedRequests=signal([]); }`,
    'daily-checklist-data.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class DailyChecklistDataService{async loadRequestsForDate(){return {requests:[],source:'server',materialized:true};}}`,
    'target.service': `import {Injectable,signal} from '@angular/core'; @Injectable({providedIn:'root'}) export class TargetService{groups=signal([]);async getAllGroups(){return [];}}`,
    'toast.service': `import { Injectable } from '@angular/core'; @Injectable({providedIn:'root'}) export class ToastService { show(message,kind){ (window.printMessages ||= []).push({message,kind}); } }`,
    'google-drive.service': `import { Injectable } from '@angular/core'; @Injectable({providedIn:'root'}) export class GoogleDriveService { async downloadFile(id){ if(window.driveFetch) return window.driveFetch(id); if(window.driveResponse) return window.driveResponse; throw new Error('Fixture has no Drive session'); } async hasServerOAuthSession(){return true;} clearSession(){} beginRedirectAuth(){} }`,
  };
  const entry = `
    import '@angular/compiler';
    import { Component, ViewChild, inject, signal, provideZonelessChangeDetection } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { bootstrapApplication } from '@angular/platform-browser';
    import { PrintPreviewModalComponent } from './src/app/shared/components/print-preview-modal/print-preview-modal.component';
    import { PrintService } from './src/app/core/services/print.service';
    import { SmartPrepComponent } from './src/app/features/preparation/smart-prep.component';
    import { DailyChecklistComponent } from './src/app/features/checklist/daily-checklist.component';
    import { DutyStatsComponent } from './src/app/features/duty-stats/duty-stats.component';
    import { StandardsPrintModalComponent } from './src/app/features/standards/components/standards-print-modal.component';
    import { buildInventoryCountDocument, buildStockCardDocument } from './src/app/features/inventory/inventory-print-document';
    import { buildSampleHandoverDocument, buildSopConfigDocument, buildTraceDocument } from './src/app/shared/utils/business-print-documents';
    import { InventoryComponent } from './src/app/features/inventory/inventory.component';
    import { LabelPrintComponent } from './src/app/features/labels/label-print.component';
    import { A4DocumentPreviewComponent } from './src/app/shared/components/a4-document-preview/a4-document-preview.component';
    @Component({selector:'print-fixture',standalone:true,imports:[PrintPreviewModalComponent,SmartPrepComponent,DailyChecklistComponent,A4DocumentPreviewComponent,StandardsPrintModalComponent,LabelPrintComponent],template:'<button id="launch">Mở xem trước</button><app-smart-prep /><app-daily-checklist [embedded]="true"/><app-print-preview-modal />@if(doc();as document){<app-a4-document-preview [document]="document" (closed)="doc.set(null)"/>}<app-standards-print-modal [isOpen]="stdOpen()" [standards]="standards()" (closeModal)="stdOpen.set(false)"/><app-label-print />'})
    class Fixture {
      service=inject(PrintService); doc=signal(null); stdOpen=signal(false); standards=signal([]); @ViewChild(StandardsPrintModalComponent) std; @ViewChild(LabelPrintComponent) labels; @ViewChild(SmartPrepComponent) prep; @ViewChild(DailyChecklistComponent) checklist;
      constructor(){
        window.printFixture=this.service;
        window.openBusinessFixture=kind=>{
          const inventory=Array.from({length:60},(_,i)=>({id:'HC-'+i,name:'Vật tư kiểm thử '+i,stock:i,unit:'mL',lotNumber:'LOT-'+i,location:'Tủ hóa chất'}));
          const history=Array.from({length:60},(_,i)=>({id:'history-'+i,timestamp:new Date(2026,8,i+1),actionType:i?'EXPORT':'CREATE',amountChange:i?-1:1000,stockAfter:1000-i,reference:'Mẻ kiểm thử '+i,user:'KNV'}));
          if(kind==='inventory')this.doc.set(buildInventoryCountDocument(inventory,'Danh sách đang lọc'));
          if(kind==='stock')this.doc.set(buildStockCardDocument({...inventory[0],stock:941},history));
          if(kind==='handover')this.doc.set(buildSampleHandoverDocument({id:'REQ-TEST',sopId:'SOP-1',sopName:'Phương pháp kiểm thử',status:'approved',timestamp:new Date(),items:[],sampleList:Array.from({length:60},(_,i)=>'MẪU-'+i),targetIds:['T1'],targetNames:{T1:'Chỉ tiêu kiểm thử'}}));
          if(kind==='sop')this.doc.set(buildSopConfigDocument({id:'SOP-1',name:'Phương pháp kiểm thử',version:2,category:'Hóa',inputs:[],variables:{n:'samples * 2'},consumables:Array.from({length:30},(_,i)=>({name:'HC-'+i,formula:'n * 0.1',unit:'mL',type:'simple'}))}));
          if(kind==='trace')this.doc.set(buildTraceDocument('LOG-TEST',[{label:'Hồ sơ',value:'REQ-TEST'}],Array.from({length:60},(_,i)=>({id:'LOG-'+i,title:'Ghi nhận '+i,timestamp:new Date(2026,8,i+1),actorName:'KNV',icon:'fa-flask',status:'info',metadata:[{label:'Mã mẻ',value:'BATCH-'+i}]})),['Chưa có thông tin thiết bị'],true));
          if(kind==='decant'){const ui=Object.create(InventoryComponent.prototype);ui.printDocument=this.doc;ui.printDecantLabel({...inventory[0],ghsWarnings:['GHS02'],hazardStatements:['H225: Chất lỏng và hơi dễ cháy']});}
        };

        window.runDutyFixture=(count=40,personal=false)=>{
          const fixture=Object.create(DutyStatsComponent.prototype);
          Object.assign(fixture,{printDocument:this.doc,duty:{loadingSchedules:()=>false,schedules:()=>Array.from({length:count},(_,i)=>({id:'shift-'+i,date:'2026-10-'+String(i%30+1).padStart(2,'0'),staffIds:i%2?['other']:['me'],startTime:'18:00',status:i===count-1?'cancelled':'planned',needsVerification:i===1,note:'Ca trực '+i,unresolvedAssignees:i===1?['Người cần xác minh']:[]}))},myStaffId:()=> 'me',myShiftsOnly:()=>personal,myStaff:()=>({displayName:'Người trực thử'}),selectedMonth:()=>10,selectedYear:()=>2026,isWeekMode:()=>false,namesFor:()=>['Chủ trì','Phối hợp'],unresolvedFor:s=>s.unresolvedAssignees,toast:{show:()=>{}}});
          fixture.printSchedule();
        };
      }
      ngAfterViewInit(){window.prepFixture=this.prep;window.checklistFixture=this.checklist; window.stdFixture=this.std; window.labelsFixture=this.labels; window.openStandards=(count=2)=>{this.standards.set(Array.from({length:count},(_,i)=>({id:'std-'+i,internal_id:'AA-'+i,name:'Chuẩn thử '+i,lot_number:'LOT-'+i,purity:'99%',storage_condition:'2–8°C',expiry_date:'2027-10-01'})));this.stdOpen.set(true);};}
    }
    bootstrapApplication(Fixture,{providers:[provideZonelessChangeDetection(),provideRouter([])]}).then(()=>window.fixtureReady=true);
  `;
  await esbuild.build({ stdin: { contents: entry, resolveDir: repo, sourcefile: 'print-fixture.ts', loader: 'ts' },
    outfile: path.join(output, 'fixture.js'), bundle: true, platform: 'browser', format: 'iife',
    nodePaths: [path.join(repo, 'node_modules')],
    tsconfig: path.join(repo, 'tsconfig.json'), logLevel: 'warning',
    plugins: [{ name: 'mock-service-boundaries', setup(build) {
      build.onResolve({ filter: /^\.\/src\// }, args => ({path:path.join(compiled,args.path.slice('./src/'.length) + '.js')}));
      build.onResolve({ filter: /(?:state|toast|google-drive|daily-checklist-data|target)\.service$/ }, args => {
        const key = args.path.split('/').pop();
        return serviceMocks[key] ? { path: key, namespace: 'mock' } : undefined;
      });
      build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: serviceMocks[args.path], loader: 'ts', resolveDir: repo }));
    }}],
  });
  const css = await postcss([tailwindcss(require('../tailwind.config')), require('autoprefixer')])
    .process(await fs.readFile(path.join(repo, 'src/styles.css'), 'utf8'), { from: path.join(repo, 'src/styles.css') });
  await fs.writeFile(path.join(output, 'fixture.css'), css.css);
  const index = await fs.readFile(path.join(repo, 'src/index.html'), 'utf8');
  const printStyles = index.match(/<style>([\s\S]*?)<\/style>/)?.[0] || '';
  const html = `<html><head><meta charset="utf-8"><link rel="stylesheet" href="/fixture.css"><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/icons.css">${printStyles}<style>@media print { print-fixture {display:none} }</style></head><body><print-fixture></print-fixture><div id="print-container"></div><script src="/fixture.js"></script></body></html>`;
  const server = http.createServer(async (request, response) => {
    if (request.url === '/') { response.setHeader('Content-Type', 'text/html; charset=utf-8'); response.end(html); return; }
    if (request.url === '/icons.css') { response.setHeader('Content-Type','text/css'); response.end(await fs.readFile(path.join(repo,'node_modules/@fortawesome/fontawesome-free/css/all.min.css'))); return; }
    if (request.url === '/fonts.css') { response.setHeader('Content-Type','text/css'); response.end((await Promise.all([300,400,500,600,700,800].map(weight=>fs.readFile(path.join(repo,'node_modules/@fontsource/open-sans',weight + '.css'),'utf8')))).join('\n')); return; }
    if (request.url.startsWith('/files/')) { response.end(await fs.readFile(path.join(repo,'node_modules/@fontsource/open-sans/files',path.basename(request.url)))); return; }
    if (request.url.startsWith('/webfonts/')) { response.end(await fs.readFile(path.join(repo,'node_modules/@fortawesome/fontawesome-free/webfonts',path.basename(request.url)))); return; }
    const file = request.url === '/fixture.js' ? 'fixture.js' : request.url === '/fixture.css' ? 'fixture.css' : null;
    if (!file) { response.writeHead(404); response.end(); return; }
    response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/css');
    response.end(await fs.readFile(path.join(output, file)));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: process.env.PRINT_BROWSER_CHANNEL || 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const open = async counts => {
    await page.evaluate(counts => {
      const jobs = counts.map((count, index) => ({
        sop: { id: 'sop-' + index, name: 'Kiểm nghiệm dung dịch ' + index, category: 'Phân tích', inputs: [{var:'analysisDate',label:'Ngày phân tích'}] },
        requestId: 'BATCH-' + index, date: new Date('2026-10-01T01:00:00Z'), user: 'Người duyệt thử nghiệm', margin: 0,
        inputs: {batchCode:'MẺ-' + index, analysisDate:'2026-10-01',sampleList:['L0101','L0102']},
        items: Array.from({length:count},(_,row)=>({name:'HC-' + index + '-' + row,totalQty:row + 1,unit:'mL',base_note:'Ghi chú đủ dài để kiểm tra xuống dòng trong ô của bảng'})),
      }));
      window.printFixture.closePreview();
      window.printFixture.openPreview(jobs);
    }, counts);
    await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent.includes('Bản in đã sẵn sàng'));
  };
  const visibleRoot = 'app-print-layout > div:not(.print-source) > .print-root';
  const countPdfPages = buffer => (buffer.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => window.fixtureReady);
    if(process.env.PRINT_SMOKE_SCOPE !== 'prep') {
    for (const counts of [[2], [2,2], [2,2,2], [2,80,2], [160]]) {
      await open(counts);
      const metrics = await page.locator(visibleRoot).evaluate(root => ({
        pages: root.children.length,
        rows: root.querySelectorAll('tbody tr').length,
        names: Array.from(root.querySelectorAll('tbody tr .item-title')).map(node => node.textContent.trim()),
        overflow: Array.from(root.querySelectorAll('.print-slip')).filter(node => node.scrollHeight > node.clientHeight + 1).length,
        qr: Array.from(root.querySelectorAll('canvas')).every(canvas => canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data.some((value,index)=>index%4===3 && value>0)),
      }));
      const expected = counts.flatMap((count,index)=>Array.from({length:count},(_,row)=>'HC-' + index + '-' + row));
      assert.deepEqual(metrics.names, expected);
      assert.equal(metrics.rows, expected.length);
      assert.equal(metrics.overflow, 0);
      assert.equal(metrics.qr, true);
      if (counts.every(count=>count===2)) assert.equal(metrics.pages, Math.ceil(counts.length/2));
      console.log('Layout fixture', counts.join('/'), metrics.pages + ' pages', metrics.rows + ' rows');
    }
    await open([2,80,2]);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button',{name:'Tải PDF',exact:true}).click();
    const download = await downloadEvent;
    const pdfPath = path.join(output, 'exported.pdf');
    await download.saveAs(pdfPath);
    const pdf = await fs.readFile(pdfPath);
    assert.ok(pdf.byteLength < 5 * 1024 * 1024, 'Synthetic multi-page PDF must stay below 5 MB');
    const previewPages = await page.locator(visibleRoot + ' > .print-page').count();
    assert.equal(countPdfPages(pdf), previewPages);
    console.log('Export PDF:', previewPages + ' pages', pdf.byteLength + ' bytes');
    await page.waitForFunction(()=>!window.printFixture.isPrinting() && !document.querySelector('app-print-preview-modal button[aria-busy="true"]'));
    await page.evaluate(()=>{
      window.print=()=> { window.capturedPrintRows=document.querySelectorAll('#print-container tbody tr').length; };
    });
    await page.getByRole('button',{name:'In',exact:true}).click();
    await page.waitForFunction(()=>window.capturedPrintRows===84);
    await page.emulateMedia({media:'print'});
    const nativePdf=await page.pdf({preferCSSPageSize:true, printBackground:true});
    assert.equal(countPdfPages(nativePdf), previewPages);
    await fs.writeFile(path.join(output,'native.pdf'),nativePdf);
    await page.emulateMedia({media:'screen'});
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await page.waitForFunction(()=>!window.printFixture.isPrinting());
    assert.equal(await page.locator('#print-container').innerHTML(), '');
    assert.equal(await page.locator('body').evaluate(body=>body.classList.contains('lims-slip-printing')),false);
    await page.setViewportSize({width:390,height:844});
    await open([2,2,2]);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),true);
    await page.getByRole('button',{name:'Vừa chiều rộng',exact:true}).click();
    await page.screenshot({path:path.join(output,'mobile.png')});
    await page.evaluate(()=>document.documentElement.classList.add('dark'));
    await page.screenshot({path:path.join(output,'mobile-dark.png')});
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!window.printFixture.isPreviewOpen());
    await page.setViewportSize({width:1366,height:900});
    await open([2,80,2]);
    await page.screenshot({path:path.join(output,'desktop-dark.png')});

    // An indivisible row that exceeds A4 must block output instead of clipping.
    await page.evaluate(()=>{
      const job=structuredClone(window.printFixture.previewJobs()[0]);
      job.items[0].base_note='Ghi chú rất dài '.repeat(1500);
      window.printFixture.openPreview([job]);
    });
    await page.getByRole('alert').waitFor();
    assert.equal(await page.getByRole('button',{name:'In',exact:true}).isDisabled(),true);
    assert.equal(await page.getByRole('button',{name:'Tải PDF',exact:true}).isDisabled(),true);
    await open([2,2]);
    await page.getByLabel('Tiêu đề',{exact:true}).uncheck();
    await page.waitForFunction(()=>!document.querySelector('app-print-layout > div:not(.print-source) .header-section'));
    assert.equal(await page.locator(visibleRoot + ' tbody tr').count(),4);

    // Delayed responses for the same PDF URL must not replace a newer version.
    await page.evaluate(()=>{
      window.driveResolvers=[];
      window.driveFetch=()=>new Promise(resolve=>window.driveResolvers.push(resolve));
      window.revokedUrls=[];
      const revoke=URL.revokeObjectURL.bind(URL);
      URL.revokeObjectURL=url=>{window.revokedUrls.push(url);revoke(url);};
      const service=window.printFixture;
      service.openPdfPreview('https://drive.google.com/file/d/same/view','Báo cáo thử',3,'Người A','2026-10-01');
      service.openPdfPreview('https://drive.google.com/file/d/same/view','Báo cáo thử',4,'Người B','2026-10-01');
      window.driveResolvers[1](new Blob(['new version'],{type:'application/pdf'}));
    });
    await page.waitForFunction(()=>window.printFixture.pdfBlobUrl()?.startsWith('blob:'));
    const currentBlob=await page.evaluate(()=>window.printFixture.pdfBlobUrl());
    await page.evaluate(()=>window.driveResolvers[0](new Blob(['old version'],{type:'application/pdf'})));
    await page.waitForFunction(()=>window.revokedUrls.length===1);
    assert.equal(await page.evaluate(()=>window.printFixture.pdfBlobUrl()),currentBlob);
    assert.equal(await page.evaluate(()=>window.printFixture.pdfVersion()),4);
    assert.equal(await page.evaluate(()=>window.printFixture.isPdfBlobLoading()),false);
    await page.evaluate(async()=>{
      const service=window.printFixture;
      service.printBlobUrl=async()=>{throw new Error('Print blocked by fixture');};
      await service.quickPrint(service.pdfUrl());
    });
    assert.equal(await page.evaluate(()=>window.printFixture.pdfVersion()),4);
    assert.equal(await page.evaluate(()=>window.printFixture.pdfAnalyst()),'Người B');
    assert.equal(await page.evaluate(()=>window.printFixture.isPrinting()),false);
    await page.getByRole('button',{name:'Đóng',exact:true}).last().click();
    assert.ok((await page.evaluate(()=>window.revokedUrls)).includes(currentBlob));
    }

    if(process.env.PRINT_SMOKE_SCOPE !== 'prep') {
    // Exercise the actual schedule method and checklist renderer with detached snapshots.
    const htmlRoot = 'app-a4-document-preview .a4-html-root';
    const closeDocument = async () => {
      await page.getByRole('button',{name:'Đóng',exact:true}).last().click();
      await page.locator('app-a4-document-preview').waitFor({state:'detached'});
    };
    const captureDocument = async name => {
      const count=await page.locator(htmlRoot+' > .print-page').count();
      assert.equal(await page.locator(htmlRoot+' .a4-html-body').evaluateAll(nodes=>nodes.some(node=>node.scrollHeight>node.clientHeight+1)),false);
      const downloadEvent=page.waitForEvent('download',{timeout:90000});
      await page.getByRole('button',{name:'Tải PDF',exact:true}).click();
      const download=await downloadEvent;
      const file=path.join(output,name+'.pdf');await download.saveAs(file);
      assert.equal(countPdfPages(await fs.readFile(file)),count);
      await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
      await page.evaluate(()=>{window.print=()=>{};});
      await page.getByRole('button',{name:'In',exact:true}).click();
      await page.waitForFunction(()=>document.querySelector('#print-container .a4-html-root'));
      await page.emulateMedia({media:'print'});
      const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});
      assert.equal(countPdfPages(pdf),count);
      await fs.writeFile(path.join(output,name+'-native.pdf'),pdf);
      await page.emulateMedia({media:'screen'});
      await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
      await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
      assert.equal(await page.locator('#print-container').innerHTML(),'');
      console.log('Administrative PDF',name,count+' pages');
    };
    for(const personal of [false,true]){
      await page.evaluate(personal=>window.runDutyFixture(40,personal),personal);
      await page.locator(htmlRoot).waitFor();
      assert.equal(await page.locator(htmlRoot+' tbody > tr').count(),personal?20:39);
      if(!personal)assert.match(await page.locator(htmlRoot).innerText(),/CẦN XÁC MINH/);
      await captureDocument('duty-'+(personal?'personal':'all'));
      await closeDocument();
    }
    await page.evaluate(()=>{
      const ui=window.checklistFixture;
      ui.selectedDate.set('2026-10-01');
      ui.dateRequests.set(Array.from({length:24},(_,i)=>({id:'REQ-'+i,sopId:'SOP-'+i,sopName:'Phương pháp kiểm tra '+i,items:[],status:'approved',analysisDate:'2026-10-01',timestamp:new Date(),sampleList:['M'+i+'A','M'+i+'B'],targetIds:['target-'+i],targetNames:{['target-'+i]:'Chỉ tiêu '+i},sampleDescriptionMap:{['M'+i+'A']:{nameSnapshot:'Mẫu cá thử nghiệm'},['M'+i+'B']:{nameSnapshot:'Mẫu tôm thử nghiệm'}}})));
      ui.loading.set(false);
    });
    for(const mode of ['list','compact'])for(const orientation of ['portrait','landscape']){
      await page.evaluate(({mode,orientation})=>{const ui=window.checklistFixture;ui.printMode.set(mode);ui.printOrientation.set(orientation);}, {mode,orientation});
      await page.waitForTimeout(50);
      await page.evaluate(()=>window.checklistFixture.executePrint());
      await page.locator(htmlRoot).waitFor();
      const expected=await page.evaluate(()=>window.checklistFixture.boardBatches().flatMap(batch=>batch.groups.map(group=>group.sampleIds)));
      const actual=await page.locator(htmlRoot+' .cl-print-samples, '+htmlRoot+' .cl-print-compact-samples').evaluateAll(nodes=>nodes.map(node=>node.textContent));
      for(const samples of expected)for(const sample of samples)assert.ok(actual.some(text=>text.includes(sample)),sample);
      assert.equal(actual.length,expected.length);
      assert.match(await page.locator(htmlRoot).innerText(),/Người giao việc/);
      await captureDocument('checklist-'+mode+'-'+orientation);
      await closeDocument();
    }

    // Standard labels: QR readiness, start-slot/copies across sheets, print cleanup.
    await page.evaluate(()=>{window.openStandards(3);window.stdFixture.printLayoutMode.set('grid');window.stdFixture.a4PaperType.set('precut');window.stdFixture.gridPreset.set('tomy_145');window.stdFixture.gridStartIndex.set(64);window.stdFixture.printCopies.set(2);window.stdFixture.printTemplate.set('qr');window.print=()=>{};});
    await page.locator('app-standards-print-modal [role="dialog"]').waitFor();
    await page.evaluate(()=>{window.standardPrintOperation=window.stdFixture.printLabel();});
    await page.waitForFunction(()=>document.querySelector('#print-area img')?.complete);
    assert.equal(await page.locator('#print-area > div').count(),2);
    assert.equal(await page.locator('#print-area img').count(),6);
    assert.equal(await page.locator('#print-area img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)),true);
    assert.match(await page.locator('#print-area').innerText(),/AA-2/);
    await page.emulateMedia({media:'print'});
    const labelPdf=await page.pdf({preferCSSPageSize:true,printBackground:true});
    assert.equal(countPdfPages(labelPdf),2);
    await fs.writeFile(path.join(output,'standard-labels-native.pdf'),labelPdf);
    await page.emulateMedia({media:'screen'});
    await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
    await page.waitForFunction(()=>!window.stdFixture.printBusy());
    assert.equal(await page.locator('#print-area').count(),0);
    assert.equal(await page.locator('#print-style').count(),0);
    await page.evaluate(()=>{window.stdFixture.gridPreset.set('tomy_138');window.standardPrintOperation=window.stdFixture.printLabel();});
    await page.locator('app-standards-print-modal [role="alert"]').waitFor();
    assert.equal(await page.locator('#print-area').count(),0);
    await page.getByRole('button',{name:'Đóng',exact:true}).last().click();
    // Sample label iframe remains alive until afterprint rather than a cleanup timer.
    await page.evaluate(()=>{
      const original=document.body.appendChild.bind(document.body);
      document.body.appendChild=node=>{const result=original(node);if(node.id==='lims-print-frame'){node.contentWindow.print=()=>window.iframePrintReady=true;}return result;};
      window.labelOperation=window.labelsFixture.printViaIframe('<html><body><div>Tem kiểm thử</div></body></html>');
    });
    await page.waitForFunction(()=>window.iframePrintReady===true);
    assert.equal(await page.locator('#lims-print-frame').count(),1);
    await page.evaluate(()=>document.getElementById('lims-print-frame').contentWindow.dispatchEvent(new Event('afterprint')));
    await page.waitForFunction(()=>!window.labelsFixture.printBusy());
    assert.equal(await page.locator('#lims-print-frame').count(),0);
    console.log('Labels: 6 standard QR labels / 2 sheets, internal codes, invalid layout blocked, iframe lifecycle passed');

    for(const kind of ['inventory','stock','handover','sop','trace','decant']){
      await page.evaluate(kind=>window.openBusinessFixture(kind),kind);
      await page.waitForFunction(()=>document.querySelector('app-a4-document-preview [role="status"]')?.textContent.includes('Bản in đã sẵn sàng'));
      const root=page.locator('app-a4-document-preview [class="origin-top-left"] > div');
      const count=await root.locator('.print-page').count();
      if(kind!=='decant'){
        const expected=await page.evaluate(()=>{const component=window.printFixture;return document.querySelector('app-a4-document-preview .a4-document-source').querySelectorAll('tbody > tr').length;});
        assert.equal(await root.locator('tbody > tr').count(),expected);
      }
      const downloadEvent=page.waitForEvent('download',{timeout:90000});
      await page.getByRole('button',{name:'Tải PDF',exact:true}).click();
      const download=await downloadEvent;const file=path.join(output,'business-'+kind+'.pdf');await download.saveAs(file);
      assert.equal(countPdfPages(await fs.readFile(file)),count);
      await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
      await page.evaluate(()=>{window.print=()=>{};});
      await page.getByRole('button',{name:'In',exact:true}).click();
      await page.waitForFunction(()=>document.querySelector('#print-container .print-page'));
      await page.emulateMedia({media:'print'});
      const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});
      assert.equal(countPdfPages(pdf),count);
      await fs.writeFile(path.join(output,'business-'+kind+'-native.pdf'),pdf);
      await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
      await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
      console.log('Business PDF',kind,count+' pages');
      await closeDocument();
    }

    }
    const prepRoot = 'app-a4-document-preview [class="origin-top-left"] > .a4-document-root';
    const openPrep = async (mode, strategy='direct', count=3) => {
      await page.evaluate(({mode,strategy,count})=>{
        const ui=window.prepFixture;
        ui.printDocument.set(null);
        ui.resetDraft();
        ui.calcMode.set(mode);
        ui.sheetMethod.set('SOP-PHA-01 v2');
        ui.sheetSource.set('Chất chuẩn thử / LOT-2026 / CoA-01');
        ui.sheetSolvent.set('Nước tinh khiết');
        ui.sheetEquipment.set('CÂN-01 / PIPET-02 / BĐM-10');
        ui.sheetPreparedBy.set('Người pha thử nghiệm');
        ui.sheetPreparedOn.set('2026-10-01');
        ui.sheetNotes.set('Đối chiếu số lô và lượng thực tế theo SOP.');
        if(mode==='target') {
          ui.targetName.set('Dung dịch chuẩn A'); ui.targetSourceValue.set(1000); ui.targetValue.set(10); ui.targetFinalVolume.set(10); ui.targetActualValue.set(110);
        } else if(mode==='concentration') {
          ui.concentrationName.set('Chất chuẩn A'); ui.concentrationActualValue.set(10.2); ui.concentrationPotency.set(98.5); ui.concentrationFinalVolume.set(10);
        } else if(mode==='spike') {
          ui.spikeSampleName.set('Mẫu thử A'); ui.spikeStandardName.set('Dung dịch chuẩn A'); ui.spikeStandardValue.set(1000); ui.spikeTargetValue.set(1); ui.spikeSampleValue.set(10);
        } else if(mode==='series') {
          ui.seriesStrategy.set(strategy); ui.seriesResidualPercent.set(10); ui.showSeriesActual.set(true); ui.seriesFinalVolume.set(10);
          const root={id:'root',name:'Chuẩn gốc A',concentration:1000,concentrationChoice:'mg_l',preparedVolume:null,preparedVolumeUnit:'mL',sourceId:'',actualSourceVolume:null};
          ui.seriesSources.set(strategy==='multi_intermediate' ? [root,{...root,id:'mid',name:'Chuẩn trung gian',concentration:100,preparedVolume:100,sourceId:'root',actualSourceVolume:10.1}] : [root]);
          ui.seriesComponents.set(strategy==='multi_component' ? [{id:'mix-A',name:'Thành phần A',sourceId:'root',targetConcentration:10,targetChoice:'mg_l'}] : []);
          ui.seriesPoints.set(strategy==='multi_component' ? [] : Array.from({length:count},(_,index)=>({id:'point-'+index,label:'Điểm '+index,objectType:index===0?'blank':index%3===0?'qc':'standard',targetConcentration:index===0?0:strategy==='serial_dilution'?100/10**(index-1):index,targetChoice:'mg_l',finalVolume:10,finalVolumeUnit:'mL',sourceId:strategy==='serial_dilution'&&index>1?'point-'+(index-1):strategy==='multi_intermediate'?'mid':'root',actualSourceVolume:index===1?0.011:null})));
        } else {
          ui.resultSampleName.set('Mẫu thử C'); ui.resultSampleValue.set(10); ui.resultInstrumentValue.set(1);
          ui.resultSteps.set([{id:'extract',label:'Chiết mẫu',type:'extract',volume:10,volumeUnit:'mL',fraction:null,recoveryPercent:null},{id:'aliquot',label:'Lấy phần dịch',type:'aliquot',volume:1,volumeUnit:'mL',fraction:null,recoveryPercent:null},{id:'dilution',label:'Pha loãng',type:'dilution',volume:10,volumeUnit:'mL',fraction:null,recoveryPercent:null}]);
        }
        ui.showTrace.set(false);
        if(!ui.canExport()) throw new Error(JSON.stringify(ui.calculation().issues));
        ui.printSimulation();
      }, {mode,strategy,count});
      await page.locator('app-a4-document-preview [role="status"]').filter({hasText:'Bản in đã sẵn sàng'}).waitFor();
      const expected=await page.evaluate(()=>window.prepFixture.printDocument().sections.flatMap(section=>section.rows.map(row=>row.cells)));
      const actual=await page.locator(prepRoot+' tbody > tr').evaluateAll(rows=>rows.map(row=>Array.from(row.children).map(cell=>cell.textContent)));
      assert.deepEqual(actual,expected);
      const metrics=await page.locator(prepRoot).evaluate(root=>({pages:root.children.length,overflow:Array.from(root.querySelectorAll('.a4-document-body')).filter(body=>body.scrollHeight>body.clientHeight+1).length}));
      assert.equal(metrics.overflow,0);
      assert.match(await page.locator(prepRoot).innerText(),/Công thức và phép thế số/);
      console.log('Prep fixture',mode,strategy,count,metrics.pages+' pages',expected.length+' rows');
      return metrics.pages;
    };
    for(const [mode,strategy,count] of [['target','direct',3],['concentration','direct',3],['spike','direct',3],['series','direct',40],['series','multi_intermediate',3],['series','serial_dilution',3],['series','multi_component',0],['result_conversion','direct',3]]) {
      const pageCount=await openPrep(mode,strategy,count);
      if(strategy==='direct') {
        const started=Date.now();
        const downloadPromise=page.waitForEvent('download',{timeout:90000});
        await page.getByRole('button',{name:'Tải PDF',exact:true}).click();
        let download;
        try { download=await downloadPromise; }
        catch(error) { console.error('PDF export messages:',await page.evaluate(()=>window.printMessages)); throw error; }
        const file=path.join(output,`prep-${mode}.pdf`);
        await download.saveAs(file);
        assert.equal(countPdfPages(await fs.readFile(file)),pageCount);
        console.log('Prep PDF',mode,(await fs.stat(file)).size+' bytes',((Date.now()-started)/1000).toFixed(1)+' seconds');
        await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
      }
      if(mode==='target'||(mode==='series'&&strategy==='direct')) {
        await page.evaluate(()=>{window.print=()=>{window.prepPrinted=true;};window.prepPrinted=false;});
        await page.getByRole('button',{name:'In',exact:true}).click();
        await page.waitForFunction(()=>window.prepPrinted);
        await page.emulateMedia({media:'print'});
        const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});
        assert.equal(countPdfPages(pdf),pageCount);
        await fs.writeFile(path.join(output,`prep-${mode}-native.pdf`),pdf);
        await page.emulateMedia({media:'screen'});
        await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
        await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview button[aria-busy="true"]'));
        assert.equal(await page.locator('#print-container').innerHTML(),'');
      }
      await page.getByRole('button',{name:'Đóng',exact:true}).last().click();
      await page.waitForFunction(()=>!document.querySelector('app-a4-document-preview'));
    }
    await page.setViewportSize({width:390,height:844});
    await openPrep('target');
    await page.evaluate(()=>document.documentElement.classList.add('dark'));
    await page.screenshot({path:path.join(output,'prep-mobile-dark.png'),animations:'disabled'});
    await page.evaluate(()=>document.documentElement.classList.remove('dark'));
    await page.screenshot({path:path.join(output,'prep-mobile.png'),animations:'disabled'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>window.prepFixture.printDocument()===null);
    await page.setViewportSize({width:1366,height:900});
    await openPrep('target');
    await page.evaluate(()=>{const snapshot=structuredClone(window.prepFixture.printDocument());snapshot.sections[0].rows[0].cells[1]='Nội dung quá dài '.repeat(3000);window.prepFixture.printDocument.set(snapshot);});
    await page.locator('app-a4-document-preview [role="alert"]').waitFor();
    assert.equal(await page.getByRole('button',{name:'In',exact:true}).isDisabled(),true);
    assert.equal(await page.getByRole('button',{name:'Tải PDF',exact:true}).isDisabled(),true);
    await page.getByRole('button',{name:'Đóng',exact:true}).last().click();
    assert.deepEqual(errors, []);
    console.log('PASS: '+(process.env.PRINT_SMOKE_SCOPE === 'prep' ? '' : 'SOP/PDF, duty/checklist, standard/sample labels, six business forms and ')+'all five Smart Prep modes/four series strategies, complete ordered rows, exported/native pages, mobile/dark/Escape and oversized-row blocking.');
    console.log('Artifacts:', output);
  } finally {
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
