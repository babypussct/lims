import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = () => [];
function SopCalibrationPointsComponent_For_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const $index_r2 = i0.ɵɵnextContext().$index;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", (ctx_r2.pointLabels || i0.ɵɵpureFunction0(1, _c0))[$index_r2], " ");
} }
function SopCalibrationPointsComponent_For_5_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 7);
    i0.ɵɵtext(2, "T\u00EAn \u0111i\u1EC3m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 8);
    i0.ɵɵtwoWayListener("ngModelChange", function SopCalibrationPointsComponent_For_5_Conditional_7_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r4); const pt_r5 = i0.ɵɵnextContext().$implicit; i0.ɵɵtwoWayBindingSet(pt_r5["loSo"], $event) || (pt_r5["loSo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopCalibrationPointsComponent_For_5_Conditional_7_Template_input_ngModelChange_3_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPointsChanged()); })("focus", function SopCalibrationPointsComponent_For_5_Conditional_7_Template_input_focus_3_listener($event) { i0.ɵɵrestoreView(_r4); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pt_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r2.inputClass);
    i0.ɵɵtwoWayProperty("ngModel", pt_r5["loSo"]);
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
} }
function SopCalibrationPointsComponent_For_5_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "label", 7);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 9);
    i0.ɵɵtwoWayListener("ngModelChange", function SopCalibrationPointsComponent_For_5_Conditional_12_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r6); const pt_r5 = i0.ɵɵnextContext().$implicit; i0.ɵɵtwoWayBindingSet(pt_r5["hamLuong"], $event) || (pt_r5["hamLuong"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopCalibrationPointsComponent_For_5_Conditional_12_Template_input_ngModelChange_3_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onPointsChanged()); })("focus", function SopCalibrationPointsComponent_For_5_Conditional_12_Template_input_focus_3_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pt_r5 = i0.ɵɵnextContext().$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.valLabel);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r2.inputClass);
    i0.ɵɵtwoWayProperty("ngModel", pt_r5["hamLuong"]);
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
} }
function SopCalibrationPointsComponent_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "div", 3)(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, SopCalibrationPointsComponent_For_5_Conditional_4_Template, 2, 2, "span", 4);
    i0.ɵɵelement(5, "span");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div");
    i0.ɵɵtemplate(7, SopCalibrationPointsComponent_For_5_Conditional_7_Template, 4, 4, "div");
    i0.ɵɵelementStart(8, "div")(9, "label", 5);
    i0.ɵɵtext(10, "S\u1ED1 l\u1ECD");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "input", 6);
    i0.ɵɵtwoWayListener("ngModelChange", function SopCalibrationPointsComponent_For_5_Template_input_ngModelChange_11_listener($event) { const pt_r5 = i0.ɵɵrestoreView(_r1).$implicit; i0.ɵɵtwoWayBindingSet(pt_r5["vialNo"], $event) || (pt_r5["vialNo"] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ngModelChange", function SopCalibrationPointsComponent_For_5_Template_input_ngModelChange_11_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onPointsChanged()); })("focus", function SopCalibrationPointsComponent_For_5_Template_input_focus_11_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.target.select()); });
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(12, SopCalibrationPointsComponent_For_5_Conditional_12_Template, 4, 5, "div");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pt_r5 = ctx.$implicit;
    const $index_r2 = ctx.$index;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r2.cardClass($index_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r2.badgeClass($index_r2));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pt_r5["loSo"] || ctx_r2.pointPrefix + $index_r2, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r2.pointLabels || i0.ɵɵpureFunction0(16, _c0)).length > $index_r2 ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap("w-1.5 h-1.5 rounded-full " + ctx_r2.dotColor);
    i0.ɵɵadvance();
    i0.ɵɵclassMap("grid gap-1.5 " + ((ctx_r2.pointLabels || i0.ɵɵpureFunction0(17, _c0)).length > 0 ? "grid-cols-1" : "grid-cols-3"));
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r2.pointLabels || i0.ɵɵpureFunction0(18, _c0)).length === 0 ? 7 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵclassMap(ctx_r2.vialInputClass);
    i0.ɵɵtwoWayProperty("ngModel", pt_r5["vialNo"]);
    i0.ɵɵproperty("disabled", ctx_r2.isReadOnly);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r2.pointLabels || i0.ɵɵpureFunction0(19, _c0)).length === 0 ? 12 : -1);
} }
/**
 * Quy tắc thống nhất cho tất cả SOP:
 *   Cột 1 – Tên điểm chuẩn : pt['loSo']   (VD: C0, C1, C2 … — KHÔNG thay đổi bằng bulk)
 *   Cột 2 – Số lọ          : pt['vialNo'] (NƠI THAO TÁC BULK "Vial chuẩn")
 *   Cột 3 – Nồng độ         : pt['hamLuong'] (VD: 0, 2, 5, 10, 20, 50)
 *
 * pointLabels[] — nếu có, hiển thị nhãn nồng độ tĩnh trên thẻ thay vì ô hamLuong
 * (dùng cho SOP Chloroform & SOP-03 vì nồng độ cố định không cần sửa).
 */
export class SopCalibrationPointsComponent {
    constructor() {
        this.title = 'Các Điểm Đường chuẩn';
        this.calibPoints = [];
        /** Nhãn nồng độ tĩnh (VD: ['0 ppb','2 ppb'…]). Nếu có → ẩn cột Tên điểm và nồng độ, chỉ edit Số lọ. */
        this.pointLabels = [];
        this.pointPrefix = 'C';
        this.suffixText = 'IS: 20 ppb';
        this.isSuffixVisible = true;
        this.valLabel = 'Nồng độ';
        this.isFuchsiaRing = true;
        this.isReadOnly = false;
        this.pointsChanged = new EventEmitter();
    }
    get dotColor() {
        return this.isFuchsiaRing ? 'bg-fuchsia-400' : 'bg-violet-400';
    }
    get gridCols() {
        const n = (this.calibPoints || []).length;
        if (n <= 3)
            return 'grid-cols-1 sm:grid-cols-3';
        if (n === 5)
            return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
        // 6 điểm
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
    }
    get inputClass() {
        const ring = this.isFuchsiaRing
            ? 'focus:ring-fuchsia-500/10 focus:border-fuchsia-500'
            : 'focus:ring-violet-500/10 focus:border-violet-500';
        return `w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60
            rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-200 font-semibold
            focus:ring-2 outline-none text-center transition ${ring}`;
    }
    get vialInputClass() {
        const ring = this.isFuchsiaRing
            ? 'focus:ring-fuchsia-500/20 focus:border-fuchsia-500'
            : 'focus:ring-cyan-500/20 focus:border-cyan-500';
        return `w-full bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/60
            rounded-lg px-2 py-1 text-xs text-cyan-800 dark:text-cyan-200 font-extrabold
            focus:ring-2 outline-none text-center transition shadow-inner ${ring}`;
    }
    cardClass(idx) {
        const borderColors = [
            'border-t-slate-400/80',
            'border-t-emerald-500',
            'border-t-teal-500',
            'border-t-indigo-500',
            'border-t-purple-500',
            'border-t-fuchsia-500',
        ];
        const color = borderColors[idx] ?? 'border-t-slate-400/80';
        return `bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80
            border-t-4 ${color} rounded-2xl p-3 shadow-sm hover:shadow-md transition duration-200`;
    }
    badgeClass(idx) {
        const configs = [
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
            'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
            'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400',
            'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
            'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400',
            'bg-fuchsia-50 dark:bg-fuchsia-950/30 text-fuchsia-700 dark:text-fuchsia-400',
        ];
        const cls = configs[idx] ?? configs[0];
        return `inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-black uppercase ${cls}`;
    }
    onPointsChanged() {
        this.pointsChanged.emit(this.calibPoints);
    }
    static { this.ɵfac = function SopCalibrationPointsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SopCalibrationPointsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SopCalibrationPointsComponent, selectors: [["app-sop-calibration-points"]], inputs: { title: "title", calibPoints: "calibPoints", pointLabels: "pointLabels", pointPrefix: "pointPrefix", suffixText: "suffixText", isSuffixVisible: "isSuffixVisible", valLabel: "valLabel", isFuchsiaRing: "isFuchsiaRing", isReadOnly: "isReadOnly" }, outputs: { pointsChanged: "pointsChanged" }, decls: 6, vars: 4, consts: [[1, "space-y-3"], [1, "block", "text-[10px]", "font-black", "text-slate-400", "dark:text-slate-500", "mb-3", "uppercase", "tracking-widest"], [3, "class"], [1, "flex", "items-center", "justify-between", "border-b", "border-slate-100", "dark:border-slate-800", "pb-1.5", "mb-2"], [1, "text-[10px]", "font-extrabold", "text-slate-600", "dark:text-slate-300"], [1, "block", "text-[8px]", "font-black", "text-cyan-600", "dark:text-cyan-400", "uppercase", "tracking-wider", "mb-0.5"], ["type", "text", "placeholder", "Vial\u2026", 3, "ngModelChange", "focus", "ngModel", "disabled"], [1, "block", "text-[8px]", "font-black", "text-slate-400", "dark:text-slate-500", "uppercase", "tracking-wider", "mb-0.5"], ["type", "text", "placeholder", "C0\u2026", 3, "ngModelChange", "focus", "ngModel", "disabled"], ["type", "text", "placeholder", "0\u2026", 3, "ngModelChange", "focus", "ngModel", "disabled"]], template: function SopCalibrationPointsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "label", 1);
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "div");
            i0.ɵɵrepeaterCreate(4, SopCalibrationPointsComponent_For_5_Template, 13, 20, "div", 2, i0.ɵɵrepeaterTrackByIndex);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵclassMap("grid gap-3 " + ctx.gridCols);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.calibPoints || i0.ɵɵpureFunction0(3, _c0));
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SopCalibrationPointsComponent, [{
        type: Component,
        args: [{ selector: 'app-sop-calibration-points', standalone: true, imports: [FormsModule], template: `
    <div class="space-y-3">
      <label class="block text-[10px] font-black text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-widest">{{ title }}</label>

      <!-- Layout thống nhất: Grid các thẻ điểm chuẩn -->
      <div [class]="'grid gap-3 ' + gridCols">
        @for (pt of (calibPoints || []); track $index) {
          <div [class]="cardClass($index)">

            <!-- Header thẻ: Tên điểm (C0/C1…) + màu dot -->
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
              <span [class]="badgeClass($index)">
                {{ pt['loSo'] || (pointPrefix + $index) }}
              </span>
              @if ((pointLabels || []).length > $index) {
                <span class="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                  {{ (pointLabels || [])[$index] }}
                </span>
              }
              <span [class]="'w-1.5 h-1.5 rounded-full ' + dotColor"></span>
            </div>

            <!-- 3 Cột: Tên điểm | Số lọ | Nồng độ -->
            <div [class]="'grid gap-1.5 ' + ((pointLabels || []).length > 0 ? 'grid-cols-1' : 'grid-cols-3')">

              <!-- Cột 1: Tên điểm chuẩn (loSo) — chỉ hiển thị nếu pointLabels rỗng -->
              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Tên điểm</label>
                  <input type="text"
                         [(ngModel)]="pt['loSo']"
                         (ngModelChange)="onPointsChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="C0…"
                         [disabled]="isReadOnly"
                         [class]="inputClass">
                </div>
              }

              <!-- Cột 2: Số lọ (vialNo) — LUÔN HIỂN THỊ, đây là nơi bulk điền -->
              <div>
                <label class="block text-[8px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-0.5">Số lọ</label>
                <input type="text"
                       [(ngModel)]="pt['vialNo']"
                       (ngModelChange)="onPointsChanged()"
                       (focus)="$any($event.target).select()"
                       placeholder="Vial…"
                       [disabled]="isReadOnly"
                       [class]="vialInputClass">
              </div>

              <!-- Cột 3: Nồng độ (hamLuong) — chỉ hiển thị nếu pointLabels rỗng -->
              @if ((pointLabels || []).length === 0) {
                <div>
                  <label class="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">{{ valLabel }}</label>
                  <input type="text"
                         [(ngModel)]="pt['hamLuong']"
                         (ngModelChange)="onPointsChanged()"
                         (focus)="$any($event.target).select()"
                         placeholder="0…"
                         [disabled]="isReadOnly"
                         [class]="inputClass">
                </div>
              }
            </div>

          </div>
        }
      </div>
    </div>
  ` }]
    }], null, { title: [{
            type: Input
        }], calibPoints: [{
            type: Input
        }], pointLabels: [{
            type: Input
        }], pointPrefix: [{
            type: Input
        }], suffixText: [{
            type: Input
        }], isSuffixVisible: [{
            type: Input
        }], valLabel: [{
            type: Input
        }], isFuchsiaRing: [{
            type: Input
        }], isReadOnly: [{
            type: Input
        }], pointsChanged: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SopCalibrationPointsComponent, { className: "SopCalibrationPointsComponent", filePath: "src/app/features/results/sops/shared/sop-calibration-points.component.ts", lineNumber: 91 }); })();
//# sourceMappingURL=sop-calibration-points.component.js.map