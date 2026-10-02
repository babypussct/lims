/* AOT browser QA for worksheet selection, shared loading and Spark read bounds. Synthetic local data only. */
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
  const output = await fs.mkdtemp(path.join(os.tmpdir(), 'lims-worksheet-smoke-'));
  console.log('Artifacts:', output);
  const compiled = path.join(output, 'compiled');
  execFileSync(process.execPath, [path.join(repo, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js'),
    '-p', path.join(repo, 'tsconfig.app.json'), '--outDir', compiled], { stdio: 'pipe' });
  const mocks = {
    'state.service': `import {Injectable,signal} from '@angular/core'; @Injectable({providedIn:'root'}) export class StateService {
      approvedRequests=signal([]); printConfig=signal({showSignature:true});
      mergeApprovedHistoryPage(rows){this.approvedRequests.set(rows);}
    }`,
    'firebase.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class FirebaseService { db={}; APP_ID='fixture'; }`,
    'auth.service': `import {Injectable,signal} from '@angular/core'; @Injectable({providedIn:'root'}) export class AuthService {
      currentUser=signal({uid:'one',email:'one@test.local'}); audit=signal(false); isStandardAuditMode(){return this.audit();}
      hasPermission(){return !!this.currentUser();} canApprove(){return this.hasPermission();} canRunBatch(){return this.hasPermission();} canViewReports(){return this.hasPermission();}
      getDeltaCacheScope(){return this.currentUser()?.uid + '|' + this.audit();}
    }`,
    'toast.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class ToastService { show(message,kind){(window.messages ||= []).push({message,kind});} }`,
    'google-drive.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class GoogleDriveService { }`,
    'firestore-read-monitor.service': `import {Injectable} from '@angular/core'; @Injectable({providedIn:'root'}) export class FirestoreReadMonitor { record(type,path,count){(window.monitored ||= []).push({type,path,count});} }`,
    firestore: `
      export const collection=(db,path)=>({path}); export const doc=(db,path)=>({path}); export const documentId=()=> '__name__';
      export const where=(field,op,value)=>({kind:'where',field,op,value}); export const orderBy=(field,direction)=>({kind:'order',field,direction});
      export const limit=size=>({kind:'limit',size}); export const startAfter=cursor=>({kind:'cursor',cursor});
      export const query=(source,...constraints)=>({...source,constraints});
      const wrap=(id,data)=>({id,data:()=>data,metadata:{fromCache:false},exists:()=>!!data});
      export async function getDoc(ref){(window.reads ||= []).push({path:ref.path,size:1});const id=ref.path.split('/').pop();return wrap(id,window.fixtureDocs[id]);}
      export async function getDocs(q){
        let rows=Object.entries(window.fixtureDocs).filter(([id,data])=>q.path.endsWith('/print_jobs')?id.startsWith('job-'):id.startsWith('batch-'));
        for(const c of q.constraints.filter(c=>c.kind==='where')) rows=rows.filter(([id,data])=>{
          const v=c.field==='__name__'?id:data[c.field];if(c.op==='in')return c.value.includes(v);
          if(c.op==='==')return v===c.value;if(v==null)return false;return c.op==='>='?v>=c.value:v<=c.value;
        });
        const sort=q.constraints.find(c=>c.kind==='order');if(sort)rows.sort((a,b)=>String(b[1][sort.field]).localeCompare(String(a[1][sort.field]))||b[0].localeCompare(a[0]));
        const cursor=q.constraints.find(c=>c.kind==='cursor');if(cursor)rows=rows.slice(rows.findIndex(([id])=>id===cursor.cursor.id)+1);
        const count=q.constraints.find(c=>c.kind==='limit');if(count)rows=rows.slice(0,count.size);
        const docs=rows.map(([id,data])=>wrap(id,data));(window.reads ||= []).push({path:q.path,size:docs.length,constraints:q.constraints});
        return {docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false}};
      }
    `,
  };
  const entry = `
    import '@angular/compiler';
    import {Component,inject,signal,provideZonelessChangeDetection} from '@angular/core';
    import {bootstrapApplication} from '@angular/platform-browser';
    import {provideRouter} from '@angular/router';
    import {BatchWorksheetPickerComponent} from './src/app/shared/components/batch-worksheet-picker/batch-worksheet-picker.component';
    import {RequestHistoryLoaderComponent} from './src/app/shared/components/request-history-loader/request-history-loader.component';
    import {PrintPreviewModalComponent} from './src/app/shared/components/print-preview-modal/print-preview-modal.component';
    import {AppPageHeaderComponent} from './src/app/shared/components/ui/page-header/page-header.component';
    import {AppButtonComponent} from './src/app/shared/components/ui/button/button.component';
    import {BatchWorksheetService} from './src/app/core/services/batch-worksheet.service';
    import {PrintService} from './src/app/core/services/print.service';
    import {StateService} from './src/app/core/services/state.service';
    import {AuthService} from './src/app/core/services/auth.service';
    window.fixtureDocs={};window.reads=[];
    for(let i=1;i<=55;i++){const id=String(i).padStart(2,'0');
      window.fixtureDocs['batch-'+id]={sopId:'sop',sopName:'Phương pháp kiểm thử '+id,status:'approved',items:[],analysisDate:'2026-10-02',currentPrintJobId:'job-'+id,inputs:{batchCode:'Mẻ '+id}};
      window.fixtureDocs['job-'+id]={requestId:'batch-'+id,sop:{id:'sop',name:'Phương pháp kiểm thử '+id,inputs:[]},inputs:{batchCode:'Mẻ '+id},margin:0,items:[],createdAt:new Date(2026,9,2),createdBy:'KNV thử'};
    }
    @Component({selector:'worksheet-fixture',standalone:true,imports:[BatchWorksheetPickerComponent,RequestHistoryLoaderComponent,PrintPreviewModalComponent,AppPageHeaderComponent,AppButtonComponent],
      template:'<main class="p-4"><app-page-header title="Yêu cầu đã duyệt">@if(showActions()){<ng-container pageHeaderActions><app-button (click)="printOne()">Phiếu phân tích</app-button><app-button>Sửa thông số mẻ</app-button></ng-container>}</app-page-header><app-batch-worksheet-picker [requests]="state.approvedRequests()"/>@if(historyVisible()){<app-request-history-loader startDate="2026-10-02" endDate="2026-10-02"/>}<p>Đã tải {{state.approvedRequests().length}} mẻ</p><app-print-preview-modal/></main>'})
    class Fixture {
      state=inject(StateService); worksheets=inject(BatchWorksheetService); prints=inject(PrintService); auth=inject(AuthService);
      historyVisible=signal(true);showActions=signal(true);constructor(){window.workflow=this;}
      printOne(){return this.worksheets.open([{requestId:'batch-55',printJobId:'job-55'}]);}
    }
    bootstrapApplication(Fixture,{providers:[provideZonelessChangeDetection(),provideRouter([])]}).then(()=>window.fixtureReady=true);
  `;
  await esbuild.build({ stdin:{contents:entry,resolveDir:repo,sourcefile:'worksheet-fixture.ts',loader:'ts'},
    outfile:path.join(output,'fixture.js'),bundle:true,platform:'browser',format:'iife',nodePaths:[path.join(repo,'node_modules')],
    tsconfig:path.join(repo,'tsconfig.json'),logLevel:'warning',plugins:[{name:'synthetic-boundaries',setup(build){
      build.onResolve({filter:/^\.\/src\//},args=>{
        const key=args.path.split('/').pop();return mocks[key]?{path:key,namespace:'mock'}:{path:path.join(compiled,args.path.slice('./src/'.length)+'.js')};
      });
      build.onResolve({filter:/firebase\/firestore|(?:state|firebase|auth|toast|google-drive|firestore-read-monitor)\.service$/},args=>{
        const key=args.path==='firebase/firestore'?'firestore':args.path.split('/').pop();return mocks[key]?{path:key,namespace:'mock'}:undefined;
      });
      build.onLoad({filter:/.*/,namespace:'mock'},args=>({contents:mocks[args.path],loader:'ts',resolveDir:repo}));
    }}] });
  const css = await postcss([tailwindcss(require('../tailwind.config')),require('autoprefixer')])
    .process(await fs.readFile(path.join(repo,'src/styles.css'),'utf8'),{from:path.join(repo,'src/styles.css')});
  await fs.writeFile(path.join(output,'fixture.css'),css.css);
  const server=http.createServer(async (request,response)=>{
    if(request.url==='/'){response.setHeader('Content-Type','text/html; charset=utf-8');response.end('<html><head><meta charset="utf-8"><link rel="stylesheet" href="/fixture.css"></head><body><worksheet-fixture></worksheet-fixture><div id="print-container"></div><script src="/fixture.js"></script></body></html>');return;}
    const name=request.url==='/fixture.js'?'fixture.js':request.url==='/fixture.css'?'fixture.css':null;
    if(!name){response.writeHead(404);response.end();return;}response.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/css');response.end(await fs.readFile(path.join(output,name)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:process.env.PRINT_BROWSER_CHANNEL || 'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:1366,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const external=[];page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:') && !request.url().startsWith('data:'))external.push(request.url());});
  try{
    await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.fixtureReady && window.workflow.state.approvedRequests().length===24);
    assert.equal(await page.getByRole('button',{name:'Phiếu phân tích',exact:true}).isVisible(),true);
    assert.equal(await page.getByRole('button',{name:'Sửa thông số mẻ',exact:true}).isVisible(),true);
    let reads=await page.evaluate(()=>window.reads);assert.equal(reads.length,3);assert.ok(reads.every(read=>read.size<=24));
    await page.getByRole('button',{name:'Tải thêm mẻ',exact:true}).click();await page.waitForFunction(()=>window.workflow.state.approvedRequests().length===48);
    const count=await page.evaluate(()=>window.reads.length);
    await page.evaluate(()=>window.workflow.historyVisible.set(false));await page.locator('app-request-history-loader').waitFor({state:'detached'});
    await page.evaluate(()=>window.workflow.historyVisible.set(true));await page.locator('app-request-history-loader').waitFor();
    assert.equal(await page.evaluate(()=>window.reads.length),count,'Re-entering a fresh range should reuse the shared cache');
    await page.getByRole('button',{name:'In nhiều phiếu',exact:true}).click();
    await page.locator('app-batch-worksheet-picker [role="dialog"]').waitFor();
    await page.locator('app-batch-worksheet-picker [role="dialog"]').evaluate(async panel => {
      await Promise.all(panel.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    const selected=await page.locator('app-batch-worksheet-picker input[aria-label]').evaluateAll(inputs=>inputs.slice(0,3).map(input=>input.getAttribute('aria-label').replace('Chọn mẻ ','')));
    for(const id of [...selected].reverse())await page.getByRole('checkbox',{name:'Chọn mẻ '+id,exact:true}).check();
    await page.screenshot({path:path.join(output,'desktop-picker.png')});
    await page.getByRole('button',{name:'Xem & in phiếu đã chọn',exact:true}).click();
    await page.waitForFunction(()=>window.workflow.prints.isPreviewOpen());
    assert.deepEqual(await page.evaluate(()=>window.workflow.prints.previewJobs().map(job=>job.requestId)),selected);
    const printReads=()=>page.evaluate(()=>window.reads.filter(read=>read.path.endsWith('/print_jobs')).length);
    assert.equal(await printReads(),1);
    await page.evaluate(()=>window.workflow.prints.closePreview());
    await page.getByRole('button',{name:'Phiếu phân tích',exact:true}).click();await page.waitForFunction(()=>window.workflow.prints.isPreviewOpen());
    assert.equal(await printReads(),1,'A worksheet from the previous selection should come from the session cache');
    await page.evaluate(()=>window.workflow.auth.currentUser.set({uid:'two',email:'two@test.local'}));
    await page.waitForFunction(()=>!window.workflow.prints.isPreviewOpen());
    await page.getByRole('button',{name:'Phiếu phân tích',exact:true}).click();await page.waitForFunction(()=>window.workflow.prints.isPreviewOpen());
    assert.equal(await printReads(),2,'Changing account must discard worksheet snapshots');
    await page.evaluate(()=>window.workflow.auth.audit.set(true));
    await page.waitForFunction(()=>!window.workflow.prints.isPreviewOpen());
    assert.equal(await page.evaluate(()=>window.workflow.prints.previewJobs().length),0);
    assert.equal(await page.evaluate(()=>window.workflow.worksheets.open([{printJobId:'job-55'}])),false);
    assert.equal(await printReads(),2,'Audit mode cannot read worksheets');
    await page.evaluate(()=>window.workflow.auth.audit.set(false));
    await page.getByRole('button',{name:'Phiếu phân tích',exact:true}).click();await page.waitForFunction(()=>window.workflow.prints.isPreviewOpen());
    assert.equal(await printReads(),3,'Leaving audit mode must reload the discarded snapshot');
    await page.evaluate(()=>{window.workflow.prints.closePreview();window.messages=[];delete window.fixtureDocs['job-01'];});
    const missing=await page.evaluate(()=>window.workflow.worksheets.open([{printJobId:'job-55'},{requestId:'batch-01',printJobId:'job-01'}]));
    assert.equal(missing,false);assert.equal(await page.evaluate(()=>window.workflow.prints.isPreviewOpen()),false);
    assert.match(await page.evaluate(()=>window.messages.at(-1).message),/batch-01/);
    await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'In nhiều phiếu',exact:true}).click();
    await page.locator('app-batch-worksheet-picker [role="dialog"]').waitFor();
    await page.locator('app-batch-worksheet-picker [role="dialog"]').evaluate(async panel => {
      await Promise.all(panel.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    assert.equal(await page.getByRole('button',{name:'Xem & in phiếu đã chọn',exact:true}).isVisible(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:path.join(output,'mobile-picker.png')});await page.keyboard.press('Escape');await page.locator('app-batch-worksheet-picker [role="dialog"]').waitFor({state:'detached'});
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    console.log('PASS: header projection, bounded history, range/session cache, multi-select order, missing snapshot, account reset and mobile/Escape.');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
