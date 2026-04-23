
import { Component, inject, computed, signal, OnInit, viewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { StateService } from '../../core/services/state.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryService } from '../inventory/inventory.service';
import { StandardService } from '../standards/standard.service'; 
import { InventoryItem } from '../../core/models/inventory.model';
import { ReferenceStandard } from '../../core/models/standard.model';
import { ToastService } from '../../core/services/toast.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { QrGlobalService } from '../../core/services/qr-global.service'; // Import Global Service
import { onSnapshot, query, collection, orderBy, limit } from 'firebase/firestore';
import { formatNum, formatDate, getAvatarUrl, formatSampleList } from '../../shared/utils/utils';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';
import Chart from 'chart.js/auto'; 

interface PriorityStandard {
    name: string;
    daysLeft: number;
    date: string;
    status: 'expired' | 'warning' | 'safe';
}

interface BatchHistoryItem {
    id: string; // Request ID / Trace ID
    timestamp: any;
    user: string;
    sampleCount: number;
    sampleList: string[]; // Raw list for this batch
    sampleDisplay: string; // Formatted range for this batch
}

interface KanbanColumn {
    sopName: string;
    sopId: string;
    totalSamples: number;
    sampleList: string[]; // Aggregated list
    sampleDisplay: string; // Formatted aggregated list
    users: Set<string>;
    batchCount: number; 
    lastRun: Date; 
    history: BatchHistoryItem[]; // Detailed history for modal
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, FormsModule, DateRangeFilterComponent], 
  template: `
    <div class="pb-20 fade-in font-sans">
        
        <!-- HEADER: Welcome & Scan -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    Xin chào, <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{{auth.currentUser()?.displayName}}</span>!
                </h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Hệ thống Quản lý Phòng thí nghiệm (LIMS) sẵn sàng.</p>
            </div>
            
            <div class="flex gap-2">
                <!-- Calls Global Service (Hidden on md and larger screens) -->
                <button (click)="qrService.startScan()" class="md:hidden px-5 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-lg shadow-slate-300 dark:shadow-none hover:bg-black dark:hover:bg-slate-600 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wide active:scale-95">
                    <i class="fa-solid fa-qrcode"></i> Quét Mã
                </button>
            </div>
        </div>

        <!-- SECTION 1: KPI CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <!-- Card 1: Pending Requests -->
            <div (click)="handlePendingRequestsClick()"
                 class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform"
                 [class.cursor-pointer]="auth.canViewSop() || auth.canViewStandards()" [class.hover:-translate-y-1]="auth.canViewSop() || auth.canViewStandards()" [class.hover:border-purple-100]="auth.canViewSop() || auth.canViewStandards()" [class.dark:hover:border-purple-500]="auth.canViewSop() || auth.canViewStandards()">
                
                @if(!auth.canViewSop() && !auth.canViewStandards()) {
                    <div class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <i class="fa-solid fa-lock text-2xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wider">Không có quyền</span>
                    </div>
                }

                <div class="flex justify-between items-start z-10" [class.opacity-20]="!auth.canViewSop() && !auth.canViewStandards()" [class.blur-sm]="!auth.canViewSop() && !auth.canViewStandards()">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Yêu cầu chờ duyệt</p>
                        <h4 class="text-2xl font-black text-gray-800 dark:text-slate-100">
                            @if(isLoading()) { <app-skeleton width="40px" height="32px"></app-skeleton> } @else { {{(auth.canViewSop() || auth.canViewStandards()) ? totalPendingRequests() : '--'}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-purple-700 to-pink-500 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform" [class.grayscale]="!auth.canViewSop() && !auth.canViewStandards()">
                        <i class="fa-solid fa-clipboard-list text-lg"></i>
                    </div>
                </div>
                <div class="z-10" [class.opacity-20]="!auth.canViewSop() && !auth.canViewStandards()" [class.blur-sm]="!auth.canViewSop() && !auth.canViewStandards()">
                    <span class="text-xs font-bold" 
                          [class.text-emerald-500]="totalPendingRequests() === 0" 
                          [class.text-fuchsia-500]="totalPendingRequests() > 0">
                        {{totalPendingRequests() > 0 ? '+ Cần xử lý ngay' : 'Đã hoàn thành'}}
                    </span>
                </div>
            </div>

            <!-- Card 2: Low Stock -->
            <div (click)="auth.canViewInventory() ? navTo('inventory') : null"
                 class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform"
                 [class.cursor-pointer]="auth.canViewInventory()" [class.hover:-translate-y-1]="auth.canViewInventory()" [class.hover:border-red-100]="auth.canViewInventory()" [class.dark:hover:border-red-500]="auth.canViewInventory()">
                
                @if(!auth.canViewInventory()) {
                    <div class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <i class="fa-solid fa-lock text-2xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wider">Không có quyền</span>
                    </div>
                }

                <div class="flex justify-between items-start z-10" [class.opacity-20]="!auth.canViewInventory()" [class.blur-sm]="!auth.canViewInventory()">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Cảnh báo Kho</p>
                        <h4 class="text-2xl font-black text-gray-800 dark:text-slate-100">
                            @if(isLoading()) { <app-skeleton width="40px" height="32px"></app-skeleton> } @else { {{auth.canViewInventory() ? lowStockItems().length : '--'}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-red-600 to-rose-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform" [class.grayscale]="!auth.canViewInventory()">
                        <i class="fa-solid fa-box-open text-lg"></i>
                    </div>
                </div>
                <div class="z-10" [class.opacity-20]="!auth.canViewInventory()" [class.blur-sm]="!auth.canViewInventory()">
                    @if(lowStockItems().length > 0) {
                        <span class="text-xs font-bold text-red-500 dark:text-red-400">Mục dưới định mức</span>
                    } @else {
                        <span class="text-xs font-bold text-emerald-500 dark:text-emerald-400">Kho ổn định</span>
                    }
                </div>
            </div>

            <!-- Card 3: Today's Activity -->
            <div (click)="auth.canViewReports() ? navTo('stats') : null"
                 class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform"
                 [class.cursor-pointer]="auth.canViewReports()" [class.hover:-translate-y-1]="auth.canViewReports()" [class.hover:border-blue-100]="auth.canViewReports()" [class.dark:hover:border-blue-500]="auth.canViewReports()">
                
                @if(!auth.canViewReports()) {
                    <div class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <i class="fa-solid fa-lock text-2xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wider">Không có quyền</span>
                    </div>
                }

                <div class="flex justify-between items-start z-10" [class.opacity-20]="!auth.canViewReports()" [class.blur-sm]="!auth.canViewReports()">
                    <div>
                        <p class="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Hoạt động hôm nay</p>
                        <h4 class="text-2xl font-black text-gray-800 dark:text-slate-100">
                            @if(isLoading()) { <app-skeleton width="40px" height="32px"></app-skeleton> } @else { {{auth.canViewReports() ? todayActivityCount() : '--'}} }
                        </h4>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-blue-500 to-cyan-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform" [class.grayscale]="!auth.canViewReports()">
                        <i class="fa-solid fa-bolt text-lg"></i>
                    </div>
                </div>
                <div class="z-10" [class.opacity-20]="!auth.canViewReports()" [class.blur-sm]="!auth.canViewReports()">
                    <span class="text-xs font-bold text-gray-400 dark:text-slate-500">Ghi nhận log hệ thống</span>
                </div>
            </div>

            <!-- Card 4: Standards Priority -->
            <div (click)="auth.canViewStandards() ? navTo('standards') : null"
                 class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-4 flex flex-col justify-between h-32 overflow-hidden group border border-transparent dark:border-slate-700 transition-transform"
                 [class.cursor-pointer]="auth.canViewStandards()" [class.hover:-translate-y-1]="auth.canViewStandards()" [class.hover:border-orange-100]="auth.canViewStandards()" [class.dark:hover:border-orange-500]="auth.canViewStandards()">
                
                @if(!auth.canViewStandards()) {
                    <div class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <i class="fa-solid fa-lock text-2xl mb-1"></i>
                        <span class="text-[10px] font-bold uppercase tracking-wider">Không có quyền</span>
                    </div>
                }

                <div class="flex justify-between items-start z-10" [class.opacity-20]="!auth.canViewStandards()" [class.blur-sm]="!auth.canViewStandards()">
                    <div class="min-w-0 pr-2">
                        <p class="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Chuẩn sắp hết hạn</p>
                        @if(priorityStandard(); as std) {
                            <h4 class="text-sm font-bold text-gray-800 dark:text-slate-100 truncate leading-tight mt-1" [title]="std.name">{{std.name}}</h4>
                        } @else {
                            <h4 class="text-lg font-black text-gray-800 dark:text-slate-100">An toàn</h4>
                        }
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tl from-orange-500 to-yellow-400 shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform" [class.grayscale]="!auth.canViewStandards()">
                        <i class="fa-solid fa-clock text-lg"></i>
                    </div>
                </div>
                <div class="z-10" [class.opacity-20]="!auth.canViewStandards()" [class.blur-sm]="!auth.canViewStandards()">
                    @if(priorityStandard(); as std) {
                        <span class="text-xs font-bold" [ngClass]="{'text-red-500 dark:text-red-400': std.status === 'expired', 'text-orange-500 dark:text-orange-400': std.status === 'warning'}">
                            {{std.daysLeft < 0 ? 'Đã hết hạn' : 'Còn ' + std.daysLeft + ' ngày'}}
                        </span>
                    } @else {
                        <span class="text-xs font-bold text-emerald-500 dark:text-emerald-400">Tất cả còn hạn dùng</span>
                    }
                </div>
            </div>
        </div>

        <!-- SECTION 2: ANALYTICS & FEED -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <!-- Left: Analytics (2/3) -->
            <div class="lg:col-span-2 relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-5 overflow-hidden flex flex-col border border-slate-100 dark:border-slate-700">
                @if(!auth.canViewReports()) {
                    <div class="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <i class="fa-solid fa-lock text-4xl mb-3"></i>
                        <span class="text-sm font-bold uppercase tracking-wider">Tính năng yêu cầu quyền truy cập Báo cáo</span>
                        <span class="text-xs mt-1">Vui lòng liên hệ Quản trị viên</span>
                    </div>
                }

                <div class="flex-1 flex flex-col" [class.opacity-20]="!auth.canViewReports()" [class.blur-sm]="!auth.canViewReports()" [class.pointer-events-none]="!auth.canViewReports()">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <div>
                            <h6 class="font-bold text-gray-700 dark:text-slate-200 capitalize text-lg">Hiệu suất Phân tích</h6>
                            <!-- Trend Indicator -->
                            <div class="flex flex-col">
                                <p class="text-sm font-bold flex items-center gap-1.5" [ngClass]="trendInfo().colorClass">
                                    <i class="fa-solid" [class]="trendInfo().icon"></i>
                                    <span>{{trendInfo().statusText}}</span>
                                    <span class="text-xs ml-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-mono">
                                        {{trendInfo().percentText}}
                                    </span>
                                </p>
                                <p class="text-gray-400 dark:text-slate-500 font-normal text-[11px] mt-1">
                                    TB {{trendInfo().currentAvg}} mẫu/ngày so với {{trendInfo().historyMean}} ({{trendInfo().historyDays}} ngày qua)
                                </p>
                            </div>
                        </div>
                        <!-- Date Filter Component -->
                        <app-date-range-filter 
                            [initStart]="startDate()" 
                            [initEnd]="endDate()" 
                            (dateChange)="onDateRangeChange($event)">
                        </app-date-range-filter>
                    </div>

                    <!-- KPIs Row -->
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">Tổng số mẫu</p>
                            <h4 class="text-xl font-black text-indigo-600 dark:text-indigo-400">{{chartKpis().totalSamples}}</h4>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">Tổng số mẻ</p>
                            <h4 class="text-xl font-black text-blue-600 dark:text-blue-400">{{chartKpis().totalBatches}}</h4>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                            <p class="text-[10px] font-bold text-slate-500 uppercase">TB Mẫu/Mẻ</p>
                            <h4 class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{chartKpis().avgSamplesPerBatch}}</h4>
                        </div>
                    </div>

                    <!-- Charts Area -->
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[250px]">
                        <div class="md:col-span-2 relative w-full h-full min-h-[200px] bg-gradient-to-b from-transparent to-gray-50/30 dark:to-slate-800/30 rounded-xl">
                            @if(isLoading()) {
                                <div class="flex items-center justify-center h-full"><app-skeleton width="100%" height="100%" shape="rect"></app-skeleton></div>
                            } @else {
                                <canvas #activityChart class="w-full h-full"></canvas>
                            }
                        </div>
                        <div class="relative w-full h-full min-h-[200px] flex flex-col items-center justify-center">
                            <h6 class="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center w-full">Phân bổ SOP</h6>
                            @if(isLoading()) {
                                <div class="flex items-center justify-center h-full w-full"><app-skeleton width="150px" height="150px" shape="circle"></app-skeleton></div>
                            } @else {
                                <div class="relative w-full h-full flex items-center justify-center">
                                    <canvas #doughnutChart class="max-w-[180px] max-h-[180px]"></canvas>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="flex flex-col gap-6">
                <!-- System Updates -->
                <div class="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl shadow-soft-xl dark:shadow-none p-5 overflow-hidden flex flex-col border border-orange-100 dark:border-orange-900/30 shrink-0">
                    <h6 class="font-bold text-orange-800 dark:text-orange-400 capitalize text-sm mb-3 flex items-center gap-2"><i class="fa-solid fa-bullhorn"></i> Thông báo Hệ thống</h6>
                    <div class="overflow-y-auto custom-scrollbar -mr-2 pr-2 max-h-48 space-y-3">
                        @for (item of systemUpdates(); track item.id) {
                            <div class="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-3 rounded-xl border border-white/20 dark:border-slate-700">
                                <div class="flex items-center gap-2 mb-1">
                                    @if(item.type === 'success') {
                                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    } @else if(item.type === 'warning') {
                                        <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    } @else {
                                        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    }
                                    <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{{item.timestamp | date:'dd/MM HH:mm'}}</span>
                                </div>
                                <div class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{{item.content}}</div>
                            </div>
                        }
                        @if (systemUpdates().length === 0) {
                            <div class="text-[10px] text-slate-500 italic py-2">Không có thông báo mới.</div>
                        }
                    </div>
                </div>

                <!-- Activity Feed -->
                <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl dark:shadow-none p-5 overflow-hidden flex flex-col min-h-[300px] border border-slate-100 dark:border-slate-700">
                    <h6 class="font-bold text-gray-700 dark:text-slate-200 capitalize text-lg mb-4">Hoạt động gần đây</h6>
                <div class="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    <div class="relative border-l border-gray-200 dark:border-slate-700 ml-3 space-y-6 pb-2">
                        @for (log of recentLogs(); track log.id) {
                            <div class="relative pl-6">
                                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                                     [ngClass]="{
                                         'bg-fuchsia-500 dark:bg-fuchsia-400': log.action.includes('APPROVE') && !log.action.includes('STANDARD'),
                                         'bg-blue-500 dark:bg-blue-400': log.action.includes('STOCK'),
                                         'bg-orange-500 dark:bg-orange-400': log.action.includes('STANDARD'),
                                         'bg-gray-400 dark:bg-slate-500': !log.action.includes('APPROVE') && !log.action.includes('STOCK') && !log.action.includes('STANDARD')
                                     }">
                                </div>
                                <div class="flex flex-col">
                                    <div class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase mb-1">{{getTimeDiff(log.timestamp)}}</div>
                                    <div class="flex items-start gap-3">
                                        <!-- UPDATED AVATAR CALL -->
                                        <img [src]="getAvatar(log.user)" class="w-8 h-8 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm object-cover bg-white dark:bg-slate-800 shrink-0" alt="Avatar">
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs font-bold text-gray-700 dark:text-slate-300 leading-tight">
                                                <span class="text-gray-900 dark:text-slate-100">{{log.user}}</span> 
                                                <span class="font-normal text-[10px] text-gray-500 dark:text-slate-400 ml-1 block sm:inline">{{getLogActionText(log.action)}}</span>
                                            </div>
                                            <p class="text-[10px] text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 bg-gray-50 dark:bg-slate-900/50 p-2 rounded-lg border border-gray-100 dark:border-slate-700 font-medium">
                                                {{log.details}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } @empty {
                            <div class="text-center text-gray-400 dark:text-slate-500 text-sm py-10">Chưa có dữ liệu.</div>
                        }
                    </div>
                </div>
            </div>
        </div>
        </div>

        <!-- SECTION 3: SMART KANBAN -->
        <div class="mb-6 relative">
            @if(!auth.canViewSop()) {
                <div class="absolute inset-0 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 rounded-2xl">
                    <i class="fa-solid fa-lock text-4xl mb-3"></i>
                    <span class="text-sm font-bold uppercase tracking-wider">Tính năng yêu cầu quyền truy cập Vận hành SOP</span>
                    <span class="text-xs mt-1">Vui lòng liên hệ Quản trị viên</span>
                </div>
            }

            <div [class.opacity-20]="!auth.canViewSop()" [class.blur-sm]="!auth.canViewSop()" [class.pointer-events-none]="!auth.canViewSop()">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
                    <h6 class="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-2">
                        <i class="fa-solid fa-layer-group text-blue-500 dark:text-blue-400"></i> Bảng theo dõi SOP (Hoàn thành)
                    </h6>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                
                @for (col of kanbanBoard(); track col.sopName) {
                    <div (click)="openSopDetails(col)" 
                         class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col cursor-pointer hover:-translate-y-1 transition-all hover:shadow-md dark:hover:border-slate-600 group relative overflow-hidden h-full">
                        
                        <!-- Header -->
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1 min-w-0 pr-2">
                                <span class="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-indigo-100 dark:border-indigo-800/30 mb-1 inline-block">
                                    {{col.batchCount}} mẻ
                                </span>
                                <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm leading-snug line-clamp-2" [title]="col.sopName">
                                    {{col.sopName}}
                                </h4>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </div>
                        </div>

                        <!-- Sample List (Grouped Text) -->
                        <div class="flex-1 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 mb-3 border border-slate-50 dark:border-slate-700/50">
                            <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wide">Mẫu đã xử lý:</div>
                            <p class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 break-words leading-relaxed line-clamp-3">
                                {{ col.sampleDisplay }}
                            </p>
                        </div>

                        <!-- Footer Info -->
                        <div class="mt-auto pt-3 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between">
                            <div class="flex -space-x-2 overflow-hidden">
                                <!-- UPDATED AVATAR CALL -->
                                @for(user of col.users; track user) {
                                    <img [src]="getAvatar(user)" class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-200 dark:bg-slate-700" [title]="user">
                                }
                            </div>
                            
                            <div class="text-right">
                                <span class="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Lần cuối: {{formatDateShort(col.lastRun)}}</span>
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Tổng: <b class="text-lg text-indigo-600 dark:text-indigo-400">{{col.totalSamples}}</b> mẫu</span>
                            </div>
                        </div>
                    </div>
                } 
                @empty {
                    @if(!isLoading()) {
                        <div class="col-span-full py-10 flex items-center justify-center text-slate-400 dark:text-slate-500 italic text-xs bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            Không có dữ liệu hiệu suất trong khoảng thời gian này.
                        </div>
                    }
                }
            </div>
            </div>
        </div>

        <!-- DETAIL MODAL -->
        @if (selectedSopDetails(); as details) {
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fade-in" (click)="selectedSopDetails.set(null)">
                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-bounce-in border border-slate-100 dark:border-slate-700" (click)="$event.stopPropagation()">
                    
                    <!-- Modal Header -->
                    <div class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 p-5 shrink-0 flex justify-between items-start">
                        <div>
                            <span class="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Chi tiết Hiệu suất</span>
                            <h3 class="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight mt-1">{{details.sopName}}</h3>
                            <div class="flex gap-2 mt-2">
                                <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-800/50">
                                    {{details.totalSamples}} mẫu
                                </span>
                                <span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200 dark:border-purple-800/50">
                                    {{details.batchCount}} mẻ
                                </span>
                            </div>
                        </div>
                        <button (click)="selectedSopDetails.set(null)" class="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition shadow-sm active:scale-90">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>

                    <!-- Modal Body: History List -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-0">
                        @for (batch of details.history; track batch.id) {
                            <div class="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center gap-2">
                                        <!-- UPDATED AVATAR CALL -->
                                        <img [src]="getAvatar(batch.user)" class="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-600">
                                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{batch.user}}</span>
                                    </div>
                                    <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 rounded">{{formatDateShort(batch.timestamp)}}</span>
                                </div>
                                
                                <div class="pl-8">
                                    <div class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                                        <span class="text-indigo-600 dark:text-indigo-400">{{batch.sampleCount}} mẫu</span>
                                    </div>
                                    <div class="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 break-words">
                                        {{batch.sampleDisplay}}
                                    </div>
                                    <div class="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button (click)="navTo('traceability/' + batch.id)" class="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold shadow-sm transition">
                                            <i class="fa-solid fa-qrcode mr-1"></i> Truy xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <!-- Modal Footer -->
                    <div class="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 shrink-0">
                        <button (click)="createBatchForSop(details.sopId)" class="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-plus"></i> Tạo Mẻ Mới Ngay
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = inject(StateService);
  invService = inject(InventoryService); 
  stdService = inject(StandardService);
  auth = inject(AuthService); 
  router: Router = inject(Router);
  toast = inject(ToastService);
  qrService = inject(QrGlobalService); // Injected Global Service
  fb = inject(FirebaseService);

  formatNum = formatNum;
  getAvatarUrl = getAvatarUrl;
  formatSampleList = formatSampleList;
  
  isLoading = signal(true);
  lowStockItems = signal<InventoryItem[]>([]); 
  priorityStandard = signal<PriorityStandard | null>(null);
  userPhotoMap = signal<Record<string, string>>({});
  
  // Date Filters
  startDate = signal<string>(this.getToday());
  endDate = signal<string>(this.getToday());

  // Modal State
  selectedSopDetails = signal<KanbanColumn | null>(null);
  
  // System Updates State
  systemUpdates = signal<any[]>([]);
  systemUpdatesSub: any;

  // LIVE DATA COMPUTED
  totalPendingRequests = computed(() => this.state.requests().length + this.state.standardRequests().length);
  recentLogs = computed(() => this.state.logs().slice(0, 6)); 
  todayActivityCount = computed(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      return this.state.logs().filter(l => {
          const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
          return d.toISOString().split('T')[0] === todayStr;
      }).length;
  });

  private parseRequestDate(req: any): Date {
      if (req.analysisDate) {
          const parts = req.analysisDate.split('-');
          if (parts.length === 3) {
              return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          }
      }
      const ts = req.approvedAt || req.timestamp;
      return (ts && typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
  }

  // TREND INDICATOR (Dynamic Comparison based on Date Filter)
  trendInfo = computed(() => {
      const history = this.state.approvedRequests();
      
      const currentStart = new Date(this.startDate()); currentStart.setHours(0,0,0,0);
      const currentEnd = new Date(this.endDate()); currentEnd.setHours(23,59,59,999);
      
      const diffTime = Math.abs(currentEnd.getTime() - currentStart.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate current total
      let currentTotal = 0;
      const tCurrStart = currentStart.getTime();
      const tCurrEnd = currentEnd.getTime();

      history.forEach(req => {
          const timestamp = this.parseRequestDate(req).getTime();
          if (timestamp >= tCurrStart && timestamp <= tCurrEnd) {
              let count = 1;
              if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
              else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
              currentTotal += count;
          }
      });

      const currentAvg = diffDays > 0 ? currentTotal / diffDays : currentTotal;

      // Historical period (30 days prior to currentStart)
      const historyDays = 30;
      const historyEnd = new Date(currentStart); historyEnd.setDate(historyEnd.getDate() - 1); historyEnd.setHours(23,59,59,999);
      const historyStart = new Date(historyEnd); historyStart.setDate(historyStart.getDate() - historyDays + 1); historyStart.setHours(0,0,0,0);

      const tHistStart = historyStart.getTime();
      const tHistEnd = historyEnd.getTime();

      // Daily totals for history
      const dailyTotals = new Array(historyDays).fill(0);
      history.forEach(req => {
          const timestamp = this.parseRequestDate(req).getTime();
          if (timestamp >= tHistStart && timestamp <= tHistEnd) {
              const dayIndex = Math.floor((timestamp - tHistStart) / (1000 * 60 * 60 * 24));
              if (dayIndex >= 0 && dayIndex < historyDays) {
                  let count = 1;
                  if (req.sampleList && req.sampleList.length > 0) count = req.sampleList.length;
                  else if (req.inputs?.['n_sample']) count = Number(req.inputs['n_sample']);
                  dailyTotals[dayIndex] += count;
              }
          }
      });

      // Calculate Mean and StdDev
      const historyMean = dailyTotals.reduce((a, b) => a + b, 0) / historyDays;
      const variance = dailyTotals.reduce((a, b) => a + Math.pow(b - historyMean, 2), 0) / historyDays;
      const historyStdDev = Math.sqrt(variance);

      // Z-Score and Status
      const zScore = historyStdDev > 0 ? (currentAvg - historyMean) / historyStdDev : (currentAvg > historyMean ? 1.1 : (currentAvg < historyMean ? -1.1 : 0));
      
      let status: 'outstanding' | 'underperforming' | 'normal' = 'normal';
      let icon = 'fa-minus';
      let colorClass = 'text-gray-500 dark:text-slate-400';
      let statusText = 'Bình thường';

      if (zScore > 1) {
          status = 'outstanding';
          icon = 'fa-arrow-trend-up';
          colorClass = 'text-emerald-500 dark:text-emerald-400';
          statusText = 'Vượt trội';
      } else if (zScore < -1) {
          status = 'underperforming';
          icon = 'fa-arrow-trend-down';
          colorClass = 'text-red-500 dark:text-red-400';
          statusText = 'Dưới mức';
      }

      // Percentage diff for Moving Average info
      let percent = 0;
      if (historyMean === 0) {
          percent = currentAvg > 0 ? 100 : 0;
      } else {
          percent = Math.round(((currentAvg - historyMean) / historyMean) * 100);
      }
      
      const percentText = percent > 0 ? `+${percent}%` : `${percent}%`;

      return { 
          status, 
          statusText,
          icon, 
          colorClass,
          currentAvg: Math.round(currentAvg * 10) / 10, 
          historyMean: Math.round(historyMean * 10) / 10, 
          percentText,
          historyDays
      };
  });

  // KANBAN COMPUTED
  kanbanBoard = computed<KanbanColumn[]>(() => {
      const approvedReqs = this.state.approvedRequests();
      const groups = new Map<string, KanbanColumn>();
      
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);

      approvedReqs.forEach(req => {
          const d = this.parseRequestDate(req);
          
          if (d < start || d > end) return;

          const key = req.sopName;
          
          if (!groups.has(key)) {
              groups.set(key, {
                  sopName: req.sopName,
                  sopId: req.sopId,
                  totalSamples: 0,
                  sampleList: [],
                  sampleDisplay: '',
                  users: new Set<string>(), 
                  batchCount: 0,
                  lastRun: d,
                  history: []
              });
          }

          const col = groups.get(key)!;
          col.batchCount++;
          if (req.user) col.users.add(req.user);
          if (d > col.lastRun) col.lastRun = d; 
          
          let currentBatchSamples: string[] = [];
          if (req.sampleList && req.sampleList.length > 0) {
              currentBatchSamples = req.sampleList;
              col.sampleList.push(...req.sampleList);
              col.totalSamples += req.sampleList.length;
          } else {
              const nSample = req.inputs?.['n_sample'] || 1;
              col.totalSamples += Number(nSample);
              currentBatchSamples = [`Batch #${req.id.substring(0,4)}`];
              col.sampleList.push(...currentBatchSamples);
          }

          col.history.push({
              id: req.id,
              timestamp: d,
              user: req.user || 'Unknown',
              sampleCount: currentBatchSamples.length,
              sampleList: currentBatchSamples,
              sampleDisplay: this.formatSampleList(currentBatchSamples)
          });
      });

      const result = Array.from(groups.values()).map(col => {
          col.sampleList.sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
          col.sampleDisplay = this.formatSampleList(col.sampleList);
          col.history.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
          return col;
      });
      
      return result.sort((a, b) => b.lastRun.getTime() - a.lastRun.getTime()); 
  });

  chartKpis = computed(() => {
      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      const history = this.state.approvedRequests();
      let totalSamples = 0;
      let totalBatches = 0;

      history.forEach(req => {
          const d = this.parseRequestDate(req);
          
          if (d >= start && d <= end) {
              totalBatches++;
              let samples = 0;
              if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
              else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
              else samples = 1;
              totalSamples += samples;
          }
      });

      const avgSamplesPerBatch = totalBatches > 0 ? (totalSamples / totalBatches).toFixed(1) : '0';
      
      return { totalSamples, totalBatches, avgSamplesPerBatch };
  });

  today = new Date();
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('activityChart');
  doughnutChartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('doughnutChart');
  chartInstance: any = null;
  doughnutChartInstance: any = null;

  constructor() {
      effect(() => {
          const reqs = this.state.approvedRequests();
          const start = this.startDate();
          const end = this.endDate();
          if (reqs.length >= 0 && !this.isLoading()) {
              setTimeout(() => this.initChart(), 300);
          }
      });
  }

  async ngOnInit() {
      this.isLoading.set(true);
      try {
          const [lowStock, nearestStd, users] = await Promise.all([
              this.invService.getLowStockItems(5),
              this.stdService.getNearestExpiry(),
              this.fb.getAllUsers()
          ]);
          this.lowStockItems.set(lowStock);
          this.processPriorityStandard(nearestStd);
          
          const map: Record<string, string> = {};
          users.forEach(u => {
              if (u.displayName && u.photoURL) {
                  map[u.displayName] = u.photoURL;
              }
          });
          this.userPhotoMap.set(map);
          this.listenSystemUpdates();
      } catch(e) {
          console.error("Dashboard fetch error", e);
      } finally {
          this.isLoading.set(false);
      }
  }

  listenSystemUpdates() {
      const updatesRef = collection(this.fb.db, `artifacts/${this.fb.APP_ID}/system_updates`);
      const q = query(updatesRef, orderBy('timestamp', 'desc'), limit(5));
      this.systemUpdatesSub = onSnapshot(q, (snap) => {
          this.systemUpdates.set(snap.docs.map(d => {
              const data = d.data();
              return {
                  id: d.id,
                  content: data['content'],
                  type: data['type'] || 'info',
                  timestamp: data['timestamp'] ? data['timestamp'].toDate() : new Date()
              };
          }));
      });
  }

  getAvatar(name: string | undefined | null): string {
      let photoUrl = name ? this.userPhotoMap()[name] : undefined;
      if (name === this.auth.currentUser()?.displayName && this.auth.currentUser()?.photoURL) {
          photoUrl = this.auth.currentUser()?.photoURL;
      }
      return this.getAvatarUrl(name, this.state.avatarStyle(), photoUrl);
  }

  ngOnDestroy(): void {
      if (this.systemUpdatesSub) this.systemUpdatesSub();
      if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
      }
      if (this.doughnutChartInstance) {
          this.doughnutChartInstance.destroy();
          this.doughnutChartInstance = null;
      }
  }

  private getToday(): string { return new Date().toISOString().split('T')[0]; }

  onDateRangeChange(range: { start: string, end: string, label: string }) {
      this.startDate.set(range.start);
      this.endDate.set(range.end);
  }

  formatDateShort(date: Date): string {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
             date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  openSopDetails(col: KanbanColumn) {
      this.selectedSopDetails.set(col);
  }

  createBatchForSop(sopId: string) {
      const sop = this.state.sops().find(s => s.id === sopId);
      if (sop) {
          this.state.selectedSop.set(sop);
          this.router.navigate(['/calculator']);
      } else {
          this.toast.show('Không tìm thấy quy trình gốc.', 'error');
      }
  }

  async initChart() {
      const canvas = this.chartCanvas()?.nativeElement;
      const dCanvas = this.doughnutChartCanvas()?.nativeElement;
      if (!canvas || !dCanvas) return;

      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();
      const existingDChart = Chart.getChart(dCanvas);
      if (existingDChart) existingDChart.destroy();

      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
      if (this.doughnutChartInstance) { this.doughnutChartInstance.destroy(); this.doughnutChartInstance = null; }

      const ctx = canvas.getContext('2d');
      const dCtx = dCanvas.getContext('2d');
      if (!ctx || !dCtx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(203, 12, 159, 0.2)'); 
      gradient.addColorStop(1, 'rgba(203, 12, 159, 0)');

      const start = new Date(this.startDate()); start.setHours(0,0,0,0);
      const end = new Date(this.endDate()); end.setHours(23,59,59,999);
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      let chartStart = new Date(start);
      let chartEnd = new Date(end);
      let chartDays = diffDays;

      // If selected range is <= 7 days, force chart to show Monday-Sunday of that week
      if (diffDays <= 7) {
          const dayOfWeek = start.getDay(); // 0 is Sunday, 1 is Monday
          const diffToMonday = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          chartStart = new Date(start.setDate(diffToMonday));
          chartStart.setHours(0,0,0,0);
          
          chartEnd = new Date(chartStart);
          chartEnd.setDate(chartStart.getDate() + 6);
          chartEnd.setHours(23,59,59,999);
          
          chartDays = 7;
      }
      
      const labels = [];
      const sampleData = new Array(chartDays).fill(0);
      const runData = new Array(chartDays).fill(0);
      const dailyDetails: Record<string, number>[] = new Array(chartDays).fill(null).map(() => ({}));
      const dateMap = new Map<string, number>();
      
      for (let i = 0; i < chartDays; i++) {
          const d = new Date(chartStart); d.setDate(d.getDate() + i);
          
          // Format label: 'T2 15/3'
          const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          const dayName = days[d.getDay()];
          const key = diffDays <= 7 ? `${dayName} ${d.getDate()}/${d.getMonth() + 1}` : `${d.getDate()}/${d.getMonth() + 1}`;
          
          labels.push(key); 
          // Use a consistent key for mapping data
          const mapKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          dateMap.set(mapKey, i);
      }

      const sopCounts = new Map<string, number>();

      const history = this.state.approvedRequests();
      history.forEach(req => {
          const d = this.parseRequestDate(req);
          
          // Only count data within the chart's display range
          if (d >= chartStart && d <= chartEnd) {
              const mapKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              const idx = dateMap.get(mapKey);
              if (idx !== undefined) {
                  runData[idx]++;
                  let samples = 0;
                  if (req.sampleList && req.sampleList.length > 0) samples = req.sampleList.length;
                  else if (req.inputs?.['n_sample']) samples = Number(req.inputs['n_sample']);
                  else samples = 1;
                  sampleData[idx] += samples; 
                  
                  // SOP Distribution (only for the actually selected range, not the whole week if they only selected 1 day)
                  if (d >= start && d <= end) {
                      const sopName = req.sopName || 'Unknown';
                      sopCounts.set(sopName, (sopCounts.get(sopName) || 0) + samples);
                  }
                  
                  // Daily details
                  const sopName = req.sopName || 'Unknown';
                  dailyDetails[idx][sopName] = (dailyDetails[idx][sopName] || 0) + samples;
              }
          }
      });

      // Line Chart
      this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [
                  { 
                      label: 'Số mẫu', data: sampleData, backgroundColor: gradient, borderColor: '#cb0c9f', borderWidth: 3, 
                      pointRadius: 4, pointBackgroundColor: '#cb0c9f', pointBorderColor: '#fff', pointHoverRadius: 6, fill: true, tension: 0.4, yAxisID: 'y'
                  },
                  { 
                      label: 'Số mẻ', data: runData, type: 'bar', backgroundColor: '#3a416f', borderRadius: 4, barThickness: 10, order: 1, yAxisID: 'y1' 
                  }
              ]
          },
          options: { 
              responsive: true, maintainAspectRatio: false, 
              plugins: { 
                  legend: { display: false }, 
                  tooltip: { 
                      backgroundColor: '#fff', 
                      titleColor: '#1e293b', 
                      bodyColor: '#1e293b', 
                      borderColor: '#e2e8f0', 
                      borderWidth: 1, 
                      padding: 10, 
                      displayColors: true, 
                      usePointStyle: true,
                      callbacks: {
                          afterBody: (context: any) => {
                              const index = context[0].dataIndex;
                              const details = dailyDetails[index];
                              if (!details || Object.keys(details).length === 0) return '';
                              let text = '\nChi tiết mẫu theo SOP:';
                              for (const [sop, count] of Object.entries(details)) {
                                  text += `\n- ${sop}: ${count} mẫu`;
                              }
                              return text;
                          }
                      }
                  } 
              }, 
              interaction: { mode: 'index', intersect: false },
              scales: { 
                  x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8' } }, 
                  y: { type: 'linear', display: true, position: 'left', beginAtZero: true, grid: { tickBorderDash: [5, 5], color: '#f1f5f9' }, border: { display: false }, ticks: { font: { size: 10, family: "'Open Sans', sans-serif" }, color: '#94a3b8', maxTicksLimit: 5 } }, 
                  y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { display: false }, border: { display: false }, ticks: { display: false } } 
              } 
          }
      });

      // Doughnut Chart
      const sopLabels = Array.from(sopCounts.keys());
      const sopData = Array.from(sopCounts.values());
      const bgColors = ['#cb0c9f', '#3a416f', '#17c1e8', '#82d616', '#ea0606', '#ff9800', '#9c27b0', '#00bcd4'];

      this.doughnutChartInstance = new Chart(dCtx, {
          type: 'doughnut',
          data: {
              labels: sopLabels,
              datasets: [{
                  data: sopData,
                  backgroundColor: bgColors.slice(0, sopLabels.length),
                  borderWidth: 0,
                  hoverOffset: 4
              }]
          },
          options: {
              responsive: true, maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                  legend: { display: false },
                  tooltip: { 
                      backgroundColor: '#fff', 
                      titleColor: '#1e293b', 
                      bodyColor: '#1e293b', 
                      borderColor: '#e2e8f0', 
                      borderWidth: 1, 
                      padding: 10, 
                      displayColors: true, 
                      usePointStyle: true,
                      callbacks: {
                          label: (context: any) => {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.chart._metasets[context.datasetIndex].total;
                              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                              return `${label}: ${value} mẫu (${percentage}%)`;
                          }
                      }
                  }
              }
          }
      });
  }

  processPriorityStandard(std: ReferenceStandard | null) {
      if (!std || !std.expiry_date) { this.priorityStandard.set(null); return; }
      const expiry = new Date(std.expiry_date); const today = new Date();
      const diffMs = expiry.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      let status: 'expired' | 'warning' | 'safe';
      if (daysLeft < 0) status = 'expired'; else if (daysLeft < 60) status = 'warning'; else status = 'safe';
      this.priorityStandard.set({ name: std.name, daysLeft, date: std.expiry_date, status });
  }

  navTo(path: string) { this.router.navigate(['/' + path]); }
  denyAccess() { this.toast.show('Bạn không có quyền truy cập chức năng này!', 'error'); }

  handlePendingRequestsClick() {
      if (!this.auth.canViewSop() && !this.auth.canViewStandards()) return;
      
      const pendingSop = this.state.requests().length;
      const pendingStandard = this.state.standardRequests().length;

      if (pendingSop === 0 && pendingStandard > 0 && this.auth.canViewStandards()) {
          this.navTo('standard-requests');
      } else if (this.auth.canViewSop()) {
          this.navTo('requests');
      } else if (this.auth.canViewStandards()) {
          this.navTo('standard-requests');
      }
  }

  getTimeDiff(timestamp: any): string {
      if (!timestamp) return '';
      const date = (timestamp as any).toDate ? (timestamp as any).toDate() : new Date(timestamp);
      const now = new Date(); const diffMs = now.getTime() - date.getTime(); const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Vừa xong'; if (diffMins < 60) return `${diffMins} phút trước`;
      const diffHours = Math.floor(diffMins / 60); if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${Math.floor(diffHours / 24)} ngày trước`;
  }
  
  getLogActionText(action: string): string {
      if (action === 'REQUEST_STANDARD' || action === 'CREATE_STANDARD_REQUEST') return 'đã yêu cầu mượn chuẩn';
      if (action === 'APPROVE_STANDARD_REQUEST') return 'đã duyệt mượn chuẩn';
      if (action === 'REJECT_STANDARD_REQUEST') return 'đã từ chối mượn chuẩn';
      if (action === 'REPORT_RETURN_STANDARD') return 'đã báo cáo trả chuẩn';
      if (action === 'RETURN_STANDARD') return 'đã nhận lại chuẩn';
      if (action === 'ASSIGN_STANDARD') return 'đã gán chuẩn cho mượn';
      
      if (action.includes('APPROVE')) return 'đã duyệt yêu cầu'; 
      if (action.includes('STOCK_IN')) return 'đã nhập kho';
      if (action.includes('STOCK_OUT')) return 'đã xuất kho'; 
      if (action.includes('CREATE')) return 'đã tạo mới';
      if (action.includes('DELETE')) return 'đã xóa'; 
      return 'đã cập nhật';
  }
}
