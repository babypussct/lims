
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar.component';
import { CalculatorComponent } from './components/calculator.component';
import { InventoryComponent } from './components/inventory.component';
import { RequestListComponent } from './components/request-list.component';
import { StatisticsComponent } from './components/statistics.component';
import { SopEditorComponent } from './components/sop-editor.component';
import { ConfigComponent } from './components/config.component';
import { LoginComponent } from './components/login.component';
import { PrintLayoutComponent } from './components/print-layout.component';
import { ConfirmationModalComponent } from './components/confirmation-modal.component';
import { BatchPrintComponent } from './components/print-preview.component';
import { PrintQueueComponent } from './components/print-queue.component';
import { StateService } from './services/state.service';
import { AuthService } from './services/auth.service';
import { Sop } from './models/sop.model';
import { ToastService } from './services/toast.service';
import { PrintService } from './services/print.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    CalculatorComponent, 
    InventoryComponent,
    RequestListComponent,
    StatisticsComponent,
    SopEditorComponent,
    ConfigComponent,
    LoginComponent,
    PrintLayoutComponent,
    ConfirmationModalComponent,
    BatchPrintComponent,
    PrintQueueComponent
  ],
  template: `
    <app-login class="no-print"></app-login>
    
    <!-- Toasts -->
    <div class="fixed top-4 right-4 z-[100] space-y-2 no-print">
      @for (t of toast.toasts(); track t.id) {
        <div class="px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm animate-bounce-in"
             [class.bg-emerald-500]="t.type === 'success'"
             [class.bg-red-500]="t.type === 'error'"
             [class.bg-blue-500]="t.type === 'info'">
             {{t.message}}
        </div>
      }
    </div>

    <!-- Print Loading Overlay -->
    @if (printService.isProcessing()) {
      <div class="fixed inset-0 z-[101] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm no-print fade-in">
        <div class="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500"></i>
          <span class="font-bold text-slate-700">Đang xử lý...</span>
        </div>
      </div>
    }

    <!-- Confirmation Modal (Global) -->
    <app-confirmation-modal></app-confirmation-modal>

    <!-- Main App: Visible to ANY logged in user (Staff or Manager) -->
    @if (state.currentUser()) {
      <div class="h-screen flex flex-col bg-slate-100 no-print">
        
        <!-- Professional Dark Header -->
        <header class="bg-slate-900 border-b border-slate-800 h-16 flex items-center px-6 justify-between shrink-0 z-30 relative no-print text-white shadow-md">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50 border border-blue-400/30">
                     <i class="fa-solid fa-flask text-white text-lg"></i>
                </div>
                
                <div class="flex flex-col">
                    <h1 class="font-bold text-lg tracking-tight leading-none text-slate-100">LIMS Cloud</h1>
                    <div class="flex items-center gap-2 text-[10px] mt-1.5 font-mono">
                        <span class="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">v4.0.Angular</span>
                        
                        <span class="px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider"
                              [class]="state.isAdmin() ? 'bg-purple-900/30 border-purple-700 text-purple-400' : 'bg-blue-900/30 border-blue-700 text-blue-400'">
                            {{ state.isAdmin() ? 'MANAGER' : 'STAFF' }}
                        </span>

                        <span class="flex items-center gap-1 text-emerald-500 ml-1">
                            <span class="relative flex h-2 w-2">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                     <div class="text-sm font-bold text-slate-200">{{ state.currentUser()?.displayName }}</div>
                     <div class="text-[10px] text-slate-500">{{ state.currentUser()?.email }}</div>
                </div>
                <div class="h-8 w-px bg-slate-800 mx-2"></div>
                <button (click)="logout()" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-700 transition flex items-center justify-center" title="Đăng xuất">
                     <i class="fa-solid fa-power-off"></i>
                </button>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
           <app-sidebar 
              [activeSopId]="currentSop()?.id || null"
              (selectSop)="onSelectSop($event)" 
              (viewChange)="currentView.set($event)"
              (createNewSop)="handleNewSop()">
           </app-sidebar>
           
           <main class="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6 relative w-full">
              @switch (currentView()) {
                 @case ('calculator') {
                    @if (currentSop(); as sop) {
                        <app-calculator 
                           [sop]="sop" 
                           (editSop)="handleEditSop()">
                        </app-calculator>
                    } @else {
                        <div class="flex flex-col items-center justify-center h-full text-center text-slate-400">
                           <i class="fa-regular fa-clipboard text-6xl mb-4 text-slate-300"></i>
                           <p>Chọn quy trình từ danh sách</p>
                        </div>
                    }
                 }
                 @case ('inventory') { <app-inventory></app-inventory> }
                 @case ('requests') { <app-request-list></app-request-list> }
                 @case ('stats') { <app-statistics></app-statistics> }
                 @case ('printing') { 
                    <app-print-queue (navigateToPrint)="currentView.set('batch-print')"></app-print-queue>
                 }
                 @case ('batch-print') { 
                    <app-batch-print (closeView)="onCloseBatchPrint()"></app-batch-print>
                 }
                 
                 @case ('editor') { 
                    @if(state.isAdmin()) { 
                       <app-sop-editor 
                          [sopToEdit]="currentSop()"
                          (sopSaved)="onSopSaved($event)"
                          (cancelEdit)="onCancelEdit()">
                       </app-sop-editor> 
                    }
                    @else { <div class="p-8 text-center text-red-500 font-bold">Access Denied</div> }
                 }
                 @case ('config') { 
                    @if(state.isAdmin()) { <app-config></app-config> }
                    @else { <div class="p-8 text-center text-red-500 font-bold">Access Denied</div> }
                 }
              }
           </main>
        </div>
      </div>
    }

    <app-print-layout></app-print-layout>
  `
})
export class AppComponent {
  state = inject(StateService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  printService = inject(PrintService);
  
  currentView = signal<string>('calculator');
  currentSop = signal<Sop | null>(null);

  onSelectSop(sop: Sop) {
    this.currentSop.set(sop);
    this.currentView.set('calculator');
  }

  handleNewSop() {
    this.currentSop.set(null);
    this.currentView.set('editor');
  }

  handleEditSop() {
    this.currentView.set('editor');
  }

  onSopSaved(savedSop: Sop) {
    this.currentSop.set(savedSop);
    this.currentView.set('calculator');
  }

  onCancelEdit() {
    if (!this.currentSop()) {
        this.currentView.set('calculator');
    } else {
        this.currentView.set('calculator');
    }
  }

  onCloseBatchPrint() {
    this.currentView.set('printing');
  }

  logout() {
    this.auth.logout();
  }
}
