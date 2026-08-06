import { Component, inject, HostListener, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPanelService } from '../../../core/services/notification-panel.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.label;
function NotificationPanelComponent_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span")(1, "b", 22);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " th\u00F4ng b\u00E1o ch\u01B0a \u0111\u1ECDc");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.unreadCount());
} }
function NotificationPanelComponent_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "B\u1EA1n \u0111\u00E3 xem t\u1EA5t c\u1EA3 th\u00F4ng b\u00E1o");
    i0.ɵɵelementEnd();
} }
function NotificationPanelComponent_Conditional_0_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_12_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.markAllAsRead()); });
    i0.ɵɵelement(1, "i", 24);
    i0.ɵɵelementEnd();
} }
function NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onDeleteRead()); });
    i0.ɵɵelement(1, "i", 32);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("X\u00F3a \u0111\u00E3 \u0111\u1ECDc (", ctx_r1.readCount(), ")");
} }
function NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵtemplate(1, NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Conditional_1_Template, 4, 1, "button", 28);
    i0.ɵɵelementStart(2, "button", 29);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDeleteAll()); });
    i0.ɵɵelement(3, "i", 30);
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.readCount() > 0 ? 1 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("X\u00F3a t\u1EA5t c\u1EA3 (", ctx_r1.totalCount(), ")");
} }
function NotificationPanelComponent_Conditional_0_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 10)(1, "button", 25);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_13_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleActionsMenu()); });
    i0.ɵɵelement(2, "i", 26);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, NotificationPanelComponent_Conditional_0_Conditional_13_Conditional_3_Template, 6, 2, "div", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.showActionsMenu() ? 3 : -1);
} }
function NotificationPanelComponent_Conditional_0_For_19_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 35);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("notif-tab-count--active", ctx_r1.activeTab() === tab_r8.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", tab_r8.count(), " ");
} }
function NotificationPanelComponent_Conditional_0_For_19_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 33);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_For_19_Template_button_click_0_listener() { const tab_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.activeTab.set(tab_r8.id)); });
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, NotificationPanelComponent_Conditional_0_For_19_Conditional_3_Template, 2, 3, "span", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tab_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("notif-tab--active", ctx_r1.activeTab() === tab_r8.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(tab_r8.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(tab_r8.count() > 0 ? 3 : -1);
} }
function NotificationPanelComponent_Conditional_0_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 36);
    i0.ɵɵelement(2, "i", 37);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 38)(4, "p", 39);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 40);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.emptyIcon());
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.emptyTitle(), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.emptySubtitle(), " ");
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 61);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_12_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r11); const n_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.toggleExpand(n_r10, $event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const n_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isExpanded(n_r10) ? "\u1EA8n b\u1EDBt \u2191" : "Xem th\u00EAm \u2193", " ");
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 55)(1, "span", 62)(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(4, "i", 63);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const n_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.getChipClass(n_r10.type));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.getActionLabel(n_r10.type));
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 56);
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 64);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_16_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r12); const n_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.markAsRead(n_r10.id, $event)); });
    i0.ɵɵelement(1, "i", 65);
    i0.ɵɵelementEnd();
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 45);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Template_div_click_0_listener() { const n_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onNotificationClick(n_r10)); });
    i0.ɵɵelementStart(1, "div", 46)(2, "div", 47);
    i0.ɵɵelement(3, "i", 48);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 49)(5, "div", 50)(6, "h4", 51);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 52);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 53);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(12, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_12_Template, 2, 1, "button", 54)(13, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_13_Template, 5, 2, "div", 55);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(14, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_14_Template, 1, 0, "span", 56);
    i0.ɵɵelementStart(15, "div", 57);
    i0.ɵɵtemplate(16, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Conditional_16_Template, 2, 0, "button", 58);
    i0.ɵɵelementStart(17, "button", 59);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Template_button_click_17_listener($event) { const n_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.deleteNotification(n_r10, $event)); });
    i0.ɵɵelement(18, "i", 60);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const n_r10 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("notif-item--unread", !n_r10.isRead);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", ctx_r1.getIconClass(n_r10.type));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", ctx_r1.getIcon(n_r10.type));
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("truncate", !ctx_r1.isExpanded(n_r10));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", n_r10.title, " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", !n_r10.isRead ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")("title", ctx_r1.getFullDate(n_r10.createdAt));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.getTimeAgo(n_r10.createdAt), " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("line-clamp-2", !ctx_r1.isExpanded(n_r10));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", n_r10.message, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(n_r10.message && n_r10.message.length > 90 ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(n_r10.actionUrl ? 13 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!n_r10.isRead ? 14 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!n_r10.isRead ? 16 : -1);
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42)(1, "span", 43);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
    i0.ɵɵrepeaterCreate(3, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_For_4_Template, 19, 17, "div", 44, _forTrack0);
} if (rf & 2) {
    const group_r13 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(group_r13.label);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(group_r13.items);
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 41)(1, "button", 66);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Conditional_22_Conditional_2_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r14); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.loadMore()); });
    i0.ɵɵelement(2, "i", 67);
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("Xem th\u00EAm ", ctx_r1.totalCount() - ctx_r1.displayLimit(), " th\u00F4ng b\u00E1o");
} }
function NotificationPanelComponent_Conditional_0_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, NotificationPanelComponent_Conditional_0_Conditional_22_For_1_Template, 5, 1, null, null, _forTrack1);
    i0.ɵɵtemplate(2, NotificationPanelComponent_Conditional_0_Conditional_22_Conditional_2_Template, 5, 1, "div", 41);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r1.filteredGroups());
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.hasMore() ? 2 : -1);
} }
function NotificationPanelComponent_Conditional_0_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate2(" Hi\u1EC3n th\u1ECB ", ctx_r1.notifications().length, " / ", ctx_r1.totalCount(), " th\u00F4ng b\u00E1o ");
} }
function NotificationPanelComponent_Conditional_0_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.totalCount(), " th\u00F4ng b\u00E1o ");
} }
function NotificationPanelComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.panel.close()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(1, "div", 1)(2, "div", 2);
    i0.ɵɵelement(3, "div", 3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 4)(5, "div", 5)(6, "h2", 6);
    i0.ɵɵtext(7, "Th\u00F4ng b\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 7);
    i0.ɵɵtemplate(9, NotificationPanelComponent_Conditional_0_Conditional_9_Template, 4, 1, "span")(10, NotificationPanelComponent_Conditional_0_Conditional_10_Template, 2, 0, "span");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 8);
    i0.ɵɵtemplate(12, NotificationPanelComponent_Conditional_0_Conditional_12_Template, 2, 0, "button", 9)(13, NotificationPanelComponent_Conditional_0_Conditional_13_Template, 4, 1, "div", 10);
    i0.ɵɵelementStart(14, "button", 11);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.panel.close()); });
    i0.ɵɵelement(15, "i", 12);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "div", 13)(17, "div", 14);
    i0.ɵɵrepeaterCreate(18, NotificationPanelComponent_Conditional_0_For_19_Template, 4, 4, "button", 15, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 16);
    i0.ɵɵtemplate(21, NotificationPanelComponent_Conditional_0_Conditional_21_Template, 8, 3, "div", 17)(22, NotificationPanelComponent_Conditional_0_Conditional_22_Template, 3, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 18)(24, "span", 19);
    i0.ɵɵtemplate(25, NotificationPanelComponent_Conditional_0_Conditional_25_Template, 1, 2)(26, NotificationPanelComponent_Conditional_0_Conditional_26_Template, 1, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "button", 20);
    i0.ɵɵlistener("click", function NotificationPanelComponent_Conditional_0_Template_button_click_27_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goToSettings()); });
    i0.ɵɵelement(28, "i", 21);
    i0.ɵɵtext(29, " C\u00E0i \u0110\u1EB7t Th\u00F4ng B\u00E1o ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngStyle", ctx_r1.panelPos);
    i0.ɵɵadvance(8);
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 9 : 10);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.unreadCount() > 0 ? 12 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.totalCount() > 0 ? 13 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.tabs);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r1.filteredGroups().length === 0 ? 21 : 22);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.totalCount() > ctx_r1.displayLimit() ? 25 : 26);
} }
/**
 * NotificationPanelComponent — Premium Inbox v3 (Floating Popover + Mobile Bottom Sheet)
 *
 * Rendered at app root level (app.component.ts) to avoid sidebar stacking context z-index clipping.
 * Anchor-based placement on Desktop (below the Header bell) and Bottom Sheet on Mobile.
 */
export class NotificationPanelComponent {
    constructor() {
        this.panel = inject(NotificationPanelService);
        this.notificationService = inject(NotificationService);
        this.router = inject(Router);
        this.confirmation = inject(ConfirmationService);
        this.toast = inject(ToastService);
        this.elementRef = inject(ElementRef);
        this.notifications = this.notificationService.notifications;
        this.unreadCount = this.notificationService.unreadCount;
        this.totalCount = this.notificationService.totalCount;
        this.displayLimit = this.notificationService.displayLimit;
        this.hasMore = computed(() => this.displayLimit() < this.totalCount());
        this.readCount = computed(() => Math.max(0, this.totalCount() - this.unreadCount()));
        this.activeTab = signal('all');
        this.showActionsMenu = signal(false);
        this.expandedIds = new Set();
        // ── Tab definitions ──────────────────────────────────────────────────────
        this.SYSTEM_TYPES = new Set(['SYSTEM_INFO', 'SYSTEM_UPDATE', 'STOCK_LOW_ALERT', 'RETURN_OVERDUE']);
        this.ACTIONABLE_TYPES = new Set(['COA_REQUEST', 'BORROW_REQUEST']);
        this.tabs = [
            {
                id: 'all',
                label: 'Tất cả',
                count: computed(() => this.totalCount())
            },
            {
                id: 'unread',
                label: 'Chưa đọc',
                count: computed(() => this.unreadCount())
            },
            {
                id: 'actionable',
                label: 'Cần xử lý',
                count: computed(() => this.notifications().filter(n => !n.isRead && this.ACTIONABLE_TYPES.has(n.type)).length)
            },
            {
                id: 'system',
                label: 'Hệ thống',
                count: computed(() => this.notifications().filter(n => this.SYSTEM_TYPES.has(n.type)).length)
            }
        ];
        this.emptyIcon = computed(() => {
            if (this.activeTab() === 'unread')
                return 'fa-circle-check';
            if (this.activeTab() === 'actionable')
                return 'fa-clipboard-check';
            if (this.activeTab() === 'system')
                return 'fa-shield-halved';
            return 'fa-bell-slash';
        });
        this.emptyTitle = computed(() => {
            if (this.activeTab() === 'unread')
                return 'Tất cả đã đọc! 🎉';
            if (this.activeTab() === 'actionable')
                return 'Không có yêu cầu chờ duyệt 👍';
            if (this.activeTab() === 'system')
                return 'Không có cảnh báo hệ thống';
            return 'Chưa có thông báo nào';
        });
        this.emptySubtitle = computed(() => {
            if (this.activeTab() === 'unread')
                return 'Bạn đã xử lý hết tất cả thông báo.';
            if (this.activeTab() === 'actionable')
                return 'Tất cả yêu cầu COA và mượn trả thiết bị đã được xử lý.';
            if (this.activeTab() === 'system')
                return 'Không có cảnh báo tồn kho thấp hay cập nhật hệ thống nào.';
            return 'Các thông báo mới sẽ xuất hiện ở đây khi có hoạt động liên quan.';
        });
        // ── Filtered + grouped ────────────────────────────────────────────────────
        this.filteredGroups = computed(() => {
            const tab = this.activeTab();
            let items = this.notifications();
            if (tab === 'unread') {
                items = items.filter(n => !n.isRead);
            }
            else if (tab === 'actionable') {
                items = items.filter(n => this.ACTIONABLE_TYPES.has(n.type));
            }
            else if (tab === 'system') {
                items = items.filter(n => this.SYSTEM_TYPES.has(n.type));
            }
            if (!items.length)
                return [];
            const now = Date.now();
            const startOfToday = this.startOfDay(now);
            const startOfYesterday = startOfToday - 86_400_000;
            const startOfWeek = startOfToday - 6 * 86_400_000;
            const groups = {
                'Hôm nay': [],
                'Hôm qua': [],
                'Tuần này': [],
                'Cũ hơn': []
            };
            for (const n of items) {
                const ts = n.createdAt || 0;
                if (ts >= startOfToday)
                    groups['Hôm nay'].push(n);
                else if (ts >= startOfYesterday)
                    groups['Hôm qua'].push(n);
                else if (ts >= startOfWeek)
                    groups['Tuần này'].push(n);
                else
                    groups['Cũ hơn'].push(n);
            }
            return Object.entries(groups)
                .filter(([, list]) => list.length > 0)
                .map(([label, list]) => ({ label, items: list }));
        });
    }
    // ── Helpers ───────────────────────────────────────────────────────────────
    startOfDay(ts) {
        const d = new Date(ts);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }
    isActionable(type) {
        return this.ACTIONABLE_TYPES.has(type);
    }
    isInformational(type) {
        return type === 'SYSTEM_INFO' || type === 'SYSTEM_UPDATE';
    }
    isExpanded(n) {
        return this.expandedIds.has(n.id || '');
    }
    toggleExpand(n, event) {
        event.stopPropagation();
        const id = n.id || '';
        if (this.expandedIds.has(id)) {
            this.expandedIds.delete(id);
        }
        else {
            this.expandedIds.add(id);
        }
    }
    toggleActionsMenu() {
        this.showActionsMenu.set(!this.showActionsMenu());
    }
    loadMore() {
        this.notificationService.loadMore();
    }
    async onDeleteRead() {
        this.showActionsMenu.set(false);
        if (this.readCount() === 0)
            return;
        const confirmed = await this.confirmation.confirm({
            message: `Xóa ${this.readCount()} thông báo đã đọc? Thao tác này không thể hoàn tác.`,
            confirmText: 'Xóa đã đọc',
            isDangerous: true
        });
        if (!confirmed)
            return;
        try {
            const count = await this.notificationService.deleteReadNotifications();
            this.toast.show(`Đã xóa ${count} thông báo đã đọc.`, 'info');
        }
        catch (e) {
            this.toast.show('Lỗi xóa thông báo: ' + (e?.message || e), 'error');
        }
    }
    async onDeleteAll() {
        this.showActionsMenu.set(false);
        if (this.totalCount() === 0)
            return;
        const confirmed = await this.confirmation.confirm({
            message: `Xóa toàn bộ ${this.totalCount()} thông báo? Thao tác này không thể hoàn tác.`,
            confirmText: 'Xóa tất cả',
            isDangerous: true
        });
        if (!confirmed)
            return;
        try {
            const count = await this.notificationService.deleteAllNotifications();
            this.toast.show(`Đã xóa toàn bộ ${count} thông báo.`, 'info');
        }
        catch (e) {
            this.toast.show('Lỗi xóa thông báo: ' + (e?.message || e), 'error');
        }
    }
    onDocumentClick(event) {
        if (this.showActionsMenu()) {
            const target = event.target;
            if (!this.elementRef.nativeElement.querySelector('.notif-actions-wrapper')?.contains(target)) {
                this.showActionsMenu.set(false);
            }
        }
    }
    /** Neo popover desktop theo nút chuông Header; mobile dùng bottom sheet. */
    get panelPos() {
        if (typeof window === 'undefined' || window.innerWidth < 768) {
            return { left: '0px', bottom: '0px', top: 'auto', right: '0px' };
        }
        const bell = document.getElementById('notif-bell-header');
        if (!bell) {
            return { left: 'auto', bottom: 'auto', top: '60px', right: '12px' };
        }
        const rect = bell.getBoundingClientRect();
        const right = Math.max(12, window.innerWidth - rect.right);
        return {
            left: 'auto',
            bottom: 'auto',
            top: `${rect.bottom + 8}px`,
            right: `${right}px`
        };
    }
    onEsc() { this.panel.close(); }
    async markAllAsRead() {
        await this.notificationService.markAllAsRead();
    }
    async markAsRead(id, event) {
        event.stopPropagation();
        if (id)
            await this.notificationService.markAsRead(id);
    }
    async deleteNotification(n, event) {
        event.stopPropagation();
        if (n.id)
            await this.notificationService.deleteNotification(n.id);
    }
    async onNotificationClick(n) {
        if (!n.isRead && n.id)
            this.notificationService.markAsRead(n.id);
        this.panel.close();
        if (n.actionUrl)
            this.router.navigateByUrl(n.actionUrl);
    }
    goToSettings() {
        this.panel.close();
        this.router.navigateByUrl('/config');
    }
    // ── Icon & Color Accent maps ─────────────────────────────────────────────
    getAccentBarClass(type) {
        const map = {
            'COA_REQUEST': 'bg-purple-600 dark:bg-purple-400',
            'BORROW_REQUEST': 'bg-blue-600 dark:bg-blue-400',
            'REQUEST_APPROVED': 'bg-emerald-600 dark:bg-emerald-400',
            'REQUEST_REJECTED': 'bg-rose-600 dark:bg-rose-400',
            'STOCK_LOW_ALERT': 'bg-amber-500 dark:bg-amber-400',
            'RETURN_OVERDUE': 'bg-amber-500 dark:bg-amber-400',
            'SYSTEM_UPDATE': 'bg-orange-500 dark:bg-orange-400',
            'SYSTEM_INFO': 'bg-sky-500 dark:bg-sky-400',
        };
        return map[type] ?? 'bg-slate-400 dark:bg-slate-500';
    }
    getIconClass(type) {
        const map = {
            'COA_REQUEST': 'bg-purple-100/90 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 ring-1 ring-purple-500/20',
            'BORROW_REQUEST': 'bg-blue-100/90 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 ring-1 ring-blue-500/20',
            'REQUEST_APPROVED': 'bg-emerald-100/90 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/20',
            'REQUEST_REJECTED': 'bg-rose-100/90 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 ring-1 ring-rose-500/20',
            'STOCK_LOW_ALERT': 'bg-amber-100/90 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/20',
            'RETURN_OVERDUE': 'bg-amber-100/90 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/20',
            'SYSTEM_UPDATE': 'bg-orange-100/90 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 ring-1 ring-orange-500/20',
            'SYSTEM_INFO': 'bg-sky-100/90 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300 ring-1 ring-sky-500/20',
        };
        return map[type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
    getIcon(type) {
        const map = {
            'COA_REQUEST': 'fa-file-signature',
            'BORROW_REQUEST': 'fa-hand-holding-hand',
            'REQUEST_APPROVED': 'fa-circle-check',
            'REQUEST_REJECTED': 'fa-circle-xmark',
            'STOCK_LOW_ALERT': 'fa-triangle-exclamation',
            'RETURN_OVERDUE': 'fa-clock-rotate-left',
            'SYSTEM_UPDATE': 'fa-bullhorn',
            'SYSTEM_INFO': 'fa-circle-info',
        };
        return map[type] ?? 'fa-bell';
    }
    getChipClass(type) {
        const map = {
            'COA_REQUEST': 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
            'BORROW_REQUEST': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
            'REQUEST_APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
            'REQUEST_REJECTED': 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
            'STOCK_LOW_ALERT': 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
            'RETURN_OVERDUE': 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
        };
        return map[type] ?? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800/50';
    }
    getActionLabel(type) {
        const map = {
            'COA_REQUEST': 'Xem yêu cầu CoA',
            'BORROW_REQUEST': 'Xem yêu cầu mượn',
            'REQUEST_APPROVED': 'Xem chi tiết',
            'REQUEST_REJECTED': 'Xem lý do',
            'STOCK_LOW_ALERT': 'Xem kho',
            'RETURN_OVERDUE': 'Xem lịch hoàn trả',
            'SYSTEM_UPDATE': 'Xem cập nhật',
            'SYSTEM_INFO': 'Xem thông tin',
        };
        return map[type] ?? 'Xem chi tiết';
    }
    getTimeAgo(timestamp) {
        if (!timestamp)
            return '';
        const min = Math.floor((Date.now() - timestamp) / 60000);
        if (min < 1)
            return 'Vừa xong';
        if (min < 60)
            return `${min} phút trước`;
        const hrs = Math.floor(min / 60);
        if (hrs < 24)
            return `${hrs} giờ trước`;
        return `${Math.floor(hrs / 24)} ngày trước`;
    }
    getFullDate(timestamp) {
        if (!timestamp)
            return '';
        return new Date(timestamp).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
    static { this.ɵfac = function NotificationPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotificationPanelComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NotificationPanelComponent, selectors: [["app-notification-panel"]], hostBindings: function NotificationPanelComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function NotificationPanelComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, false, i0.ɵɵresolveDocument)("keydown.escape", function NotificationPanelComponent_keydown_escape_HostBindingHandler() { return ctx.onEsc(); }, false, i0.ɵɵresolveDocument);
        } }, decls: 1, vars: 1, consts: [["aria-hidden", "true", 1, "notif-backdrop", "fixed", "inset-0", "z-[190]", 3, "click"], ["role", "dialog", "aria-label", "Trung t\u00E2m Th\u00F4ng b\u00E1o", 1, "notif-drawer", "fixed", "z-[200]", "flex", "flex-col", 3, "ngStyle"], [1, "md:hidden", "pt-2.5", "pb-1", "flex", "justify-center", "shrink-0"], [1, "w-10", "h-1", "rounded-full", "bg-slate-300", "dark:bg-slate-700"], [1, "notif-header", "shrink-0"], [1, "min-w-0"], [1, "font-extrabold", "text-slate-950", "dark:text-slate-50", "text-[22px]", "leading-tight"], [1, "mt-1", "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400"], [1, "flex", "items-center", "gap-1.5"], ["title", "\u0110\u00E1nh d\u1EA5u t\u1EA5t c\u1EA3 \u0111\u00E3 \u0111\u1ECDc", 1, "w-9", "h-9", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "hover:bg-blue-100", "dark:hover:bg-blue-950/50", "hover:text-blue-600", "dark:hover:text-blue-400", "transition-all", "active:scale-95", "flex", "items-center", "justify-center"], [1, "relative", "notif-actions-wrapper"], [1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "hover:text-slate-800", "dark:hover:text-slate-100", "transition-all", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-xmark", "text-sm"], [1, "notif-tab-bar", "shrink-0"], [1, "notif-tab-container"], [1, "notif-tab", 3, "notif-tab--active"], [1, "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar"], [1, "h-full", "flex", "flex-col", "items-center", "justify-center", "gap-3", "py-16", "px-6", "text-center"], [1, "notif-footer", "shrink-0"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "font-medium"], [1, "text-[11px]", "font-bold", "text-blue-600", "hover:text-blue-700", "dark:text-blue-400", "dark:hover:text-blue-300", "transition-colors", "flex", "items-center", "gap-1.5", 3, "click"], [1, "fa-solid", "fa-gear", "text-[10px]"], [1, "text-blue-600", "dark:text-blue-400"], ["title", "\u0110\u00E1nh d\u1EA5u t\u1EA5t c\u1EA3 \u0111\u00E3 \u0111\u1ECDc", 1, "w-9", "h-9", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300", "hover:bg-blue-100", "dark:hover:bg-blue-950/50", "hover:text-blue-600", "dark:hover:text-blue-400", "transition-all", "active:scale-95", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-check-double", "text-xs"], ["title", "T\u00F9y ch\u1ECDn", 1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "hover:text-slate-800", "dark:hover:text-slate-100", "transition-all", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-ellipsis-vertical", "text-sm"], [1, "notif-actions-dropdown"], [1, "notif-action-item"], [1, "notif-action-item", "notif-action-item--danger", 3, "click"], [1, "fa-solid", "fa-trash-can", "text-red-500"], [1, "notif-action-item", 3, "click"], [1, "fa-solid", "fa-check-double", "text-emerald-500"], [1, "notif-tab", 3, "click"], [1, "notif-tab-count", 3, "notif-tab-count--active"], [1, "notif-tab-count"], [1, "notif-empty-icon"], [1, "fa-solid", "text-3xl", "text-slate-400", "dark:text-slate-500", 3, "ngClass"], [1, "max-w-[260px]"], [1, "font-bold", "text-slate-700", "dark:text-slate-300", "text-sm"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "mt-1", "leading-relaxed"], [1, "p-3"], [1, "notif-date-separator"], [1, "notif-date-label"], [1, "notif-item", "group", "relative", 3, "notif-item--unread"], [1, "notif-item", "group", "relative", 3, "click"], [1, "notif-item-layout"], [1, "notif-type-icon", "shrink-0", 3, "ngClass"], [1, "fa-solid", 3, "ngClass"], [1, "notif-item-body"], [1, "notif-item-heading"], [1, "font-bold", "text-[13px]", "text-slate-900", "dark:text-slate-100", "leading-snug"], [1, "notif-item-time", 3, "ngClass", "title"], [1, "text-xs", "text-slate-600", "dark:text-slate-300", "leading-relaxed", "whitespace-pre-wrap", "break-words"], [1, "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline", "mt-1", "inline-block"], [1, "mt-1.5", "flex", "items-center"], ["title", "Ch\u01B0a \u0111\u1ECDc", 1, "notif-unread-dot", "shrink-0", "self-center"], [1, "notif-item-actions"], ["title", "\u0110\u00E1nh d\u1EA5u \u0111\u00E3 \u0111\u1ECDc", 1, "w-7", "h-7", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "hover:bg-blue-100", "dark:hover:bg-blue-950/60", "text-slate-500", "hover:text-blue-600", "dark:text-slate-400", "dark:hover:text-blue-300", "flex", "items-center", "justify-center", "transition-all"], ["title", "Xo\u00E1 th\u00F4ng b\u00E1o", 1, "w-7", "h-7", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "hover:bg-rose-100", "dark:hover:bg-rose-950/60", "text-slate-500", "hover:text-rose-600", "dark:text-slate-400", "dark:hover:text-rose-300", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-solid", "fa-trash-can", "text-[10px]"], [1, "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "hover:underline", "mt-1", "inline-block", 3, "click"], [1, "notif-action-chip", 3, "ngClass"], [1, "fa-solid", "fa-arrow-right", "text-[9px]", "transition-transform", "group-hover:translate-x-0.5"], ["title", "\u0110\u00E1nh d\u1EA5u \u0111\u00E3 \u0111\u1ECDc", 1, "w-7", "h-7", "rounded-full", "bg-slate-100", "dark:bg-slate-800", "hover:bg-blue-100", "dark:hover:bg-blue-950/60", "text-slate-500", "hover:text-blue-600", "dark:text-slate-400", "dark:hover:text-blue-300", "flex", "items-center", "justify-center", "transition-all", 3, "click"], [1, "fa-solid", "fa-check", "text-[10px]"], [1, "notif-load-more-btn", 3, "click"], [1, "fa-solid", "fa-chevron-down", "text-[10px]"]], template: function NotificationPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, NotificationPanelComponent_Conditional_0_Template, 30, 6);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.panel.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, i1.NgClass, i1.NgStyle], styles: ["\n\n    .notif-backdrop[_ngcontent-%COMP%] {\n      background: transparent;\n      animation: _ngcontent-%COMP%_notifFadeIn 0.22s ease-out forwards;\n    }\n\n    \n\n\n\n\n    .notif-drawer[_ngcontent-%COMP%] {\n      width: min(400px, calc(100vw - 24px));\n      max-height: min(720px, calc(100vh - 76px));\n      background: #ffffff;\n      border-radius: 16px;\n      border: 1px solid rgba(15, 23, 42, 0.08);\n      box-shadow:\n        0 12px 28px rgba(0, 0, 0, 0.2),\n        0 2px 4px rgba(0, 0, 0, 0.08);\n      animation: _ngcontent-%COMP%_notifPopUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n      overflow: hidden;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-drawer[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-drawer[_ngcontent-%COMP%] {\n      background: #242526;\n      border-color: rgba(255, 255, 255, 0.08);\n      box-shadow:\n        0 12px 28px rgba(0, 0, 0, 0.55),\n        0 2px 4px rgba(0, 0, 0, 0.35);\n    }\n\n    \n\n    .notif-header[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 16px 16px 10px;\n    }\n\n    \n\n    .notif-actions-dropdown[_ngcontent-%COMP%] {\n      position: absolute;\n      right: 0;\n      top: 100%;\n      margin-top: 6px;\n      width: 200px;\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);\n      padding: 6px;\n      z-index: 50;\n      animation: _ngcontent-%COMP%_notifPopUp 0.18s ease-out forwards;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-actions-dropdown[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-actions-dropdown[_ngcontent-%COMP%] {\n      background: #1e293b;\n      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);\n    }\n\n    .notif-action-item[_ngcontent-%COMP%] {\n      width: 100%;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 9px 12px;\n      border-radius: 10px;\n      font-size: 11px;\n      font-weight: 600;\n      color: #475569;\n      transition: background 0.15s ease;\n      cursor: pointer;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-action-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-action-item[_ngcontent-%COMP%] {\n      color: #cbd5e1;\n    }\n\n    .notif-action-item[_ngcontent-%COMP%]:hover {\n      background: #f1f5f9;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-action-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-action-item[_ngcontent-%COMP%]:hover {\n      background: #334155;\n    }\n\n    .notif-action-item--danger[_ngcontent-%COMP%]:hover {\n      background: #fef2f2;\n      color: #ef4444;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-action-item--danger[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-action-item--danger[_ngcontent-%COMP%]:hover {\n      background: rgba(127, 29, 29, 0.3);\n      color: #f87171;\n    }\n\n    \n\n    .notif-tab-bar[_ngcontent-%COMP%] {\n      padding: 4px 12px 10px;\n      background: transparent;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-tab-bar[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-tab-bar[_ngcontent-%COMP%] {\n      background: transparent;\n    }\n\n    .notif-tab-container[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(4, minmax(0, 1fr));\n      gap: 2px;\n      background: transparent;\n      width: 100%;\n    }\n\n    .notif-tab[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 3px;\n      min-width: 0;\n      padding: 7px 4px;\n      border-radius: 999px;\n      font-size: 11px;\n      font-weight: 700;\n      color: #64748b;\n      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n      border: none;\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-tab[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-tab[_ngcontent-%COMP%] {\n      color: #94a3b8;\n    }\n\n    .notif-tab[_ngcontent-%COMP%]:hover {\n      background: #f0f2f5;\n      color: #1c1e21;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-tab[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-tab[_ngcontent-%COMP%]:hover {\n      background: #3a3b3c;\n      color: #f1f5f9;\n    }\n\n    .notif-tab--active[_ngcontent-%COMP%] {\n      background: #e7f3ff;\n      color: #0866ff;\n      box-shadow: none;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-tab--active[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-tab--active[_ngcontent-%COMP%] {\n      background: rgba(8, 102, 255, 0.2);\n      color: #7ab7ff;\n      box-shadow: none;\n    }\n\n    .notif-tab-count[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 15px;\n      height: 15px;\n      padding: 0 3px;\n      border-radius: 999px;\n      font-size: 9px;\n      font-weight: 800;\n      background: rgba(100, 116, 139, 0.15);\n      color: #64748b;\n    }\n\n    .notif-tab-count--active[_ngcontent-%COMP%] {\n      background: #0866ff;\n      color: #ffffff;\n    }\n\n    \n\n    .notif-date-separator[_ngcontent-%COMP%] {\n      position: sticky;\n      top: 0;\n      z-index: 10;\n      padding: 9px 16px 5px;\n      background: rgba(255, 255, 255, 0.96);\n    }\n\n    .dark[_nghost-%COMP%]   .notif-date-separator[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-date-separator[_ngcontent-%COMP%] {\n      background: rgba(36, 37, 38, 0.96);\n    }\n\n    .notif-date-label[_ngcontent-%COMP%] {\n      font-size: 13px;\n      font-weight: 800;\n      color: #1c1e21;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-date-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-date-label[_ngcontent-%COMP%] {\n      color: #e4e6eb;\n    }\n\n    \n\n    .notif-item[_ngcontent-%COMP%] {\n      transition: background-color 0.18s ease;\n      margin: 0 8px 2px;\n      border-radius: 12px;\n      cursor: pointer;\n      overflow: hidden;\n    }\n\n    .notif-item[_ngcontent-%COMP%]:hover {\n      background: #f0f2f5;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-item[_ngcontent-%COMP%]:hover {\n      background: #3a3b3c;\n    }\n\n    .notif-item--unread[_ngcontent-%COMP%] {\n      background: #e7f3ff;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-item--unread[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-item--unread[_ngcontent-%COMP%] {\n      background: rgba(8, 102, 255, 0.16);\n    }\n\n    .notif-item--unread[_ngcontent-%COMP%]:hover {\n      background: #dbeeff;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-item--unread[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-item--unread[_ngcontent-%COMP%]:hover {\n      background: rgba(8, 102, 255, 0.24);\n    }\n\n    \n\n    .notif-accent-bar[_ngcontent-%COMP%] {\n      display: none;\n    }\n\n    \n\n    .notif-type-icon[_ngcontent-%COMP%] {\n      width: 34px;\n      height: 34px;\n      border-radius: 999px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 12px;\n    }\n\n    .notif-item-layout[_ngcontent-%COMP%] {\n      position: relative;\n      display: flex;\n      align-items: flex-start;\n      gap: 9px;\n      padding: 9px 10px;\n    }\n\n    .notif-item-body[_ngcontent-%COMP%] {\n      flex: 1 1 auto;\n      min-width: 0;\n    }\n\n    .notif-item-heading[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) auto;\n      align-items: start;\n      gap: 8px;\n      margin-bottom: 2px;\n    }\n\n    .notif-item-time[_ngcontent-%COMP%] {\n      padding-top: 2px;\n      white-space: nowrap;\n      font-size: 9.5px;\n      font-weight: 600;\n    }\n\n    .notif-item-actions[_ngcontent-%COMP%] {\n      position: absolute;\n      top: 7px;\n      right: 7px;\n      display: flex;\n      align-items: center;\n      gap: 3px;\n      padding: 2px;\n      border-radius: 999px;\n      background: rgba(255, 255, 255, 0.96);\n      box-shadow: 0 1px 5px rgba(15, 23, 42, 0.14);\n      opacity: 0;\n      pointer-events: none;\n      transform: translateX(4px);\n      transition: opacity 0.15s ease, transform 0.15s ease;\n    }\n\n    .notif-item[_ngcontent-%COMP%]:hover   .notif-item-actions[_ngcontent-%COMP%], \n   .notif-item[_ngcontent-%COMP%]:focus-within   .notif-item-actions[_ngcontent-%COMP%] {\n      opacity: 1;\n      pointer-events: auto;\n      transform: translateX(0);\n    }\n\n    .dark[_nghost-%COMP%]   .notif-item-actions[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-item-actions[_ngcontent-%COMP%] {\n      background: rgba(36, 37, 38, 0.96);\n      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);\n    }\n\n    .notif-unread-dot[_ngcontent-%COMP%] {\n      width: 8px;\n      height: 8px;\n      border-radius: 999px;\n      background: #0866ff;\n      box-shadow: 0 0 0 3px rgba(8, 102, 255, 0.1);\n    }\n\n    \n\n    .notif-action-chip[_ngcontent-%COMP%] {\n      display: inline-flex;\n      align-items: center;\n      gap: 5px;\n      padding: 3px 8px;\n      border-radius: 999px;\n      font-size: 10px;\n      font-weight: 700;\n      border: 1px solid transparent;\n      transition: all 0.18s ease;\n      background: #e7f3ff !important;\n      color: #0866ff !important;\n      border-color: transparent !important;\n    }\n\n    \n\n    .notif-load-more-btn[_ngcontent-%COMP%] {\n      width: 100%;\n      padding: 9px 14px;\n      border-radius: 8px;\n      border: 0;\n      background: #e7f3ff;\n      color: #0866ff;\n      font-size: 11px;\n      font-weight: 700;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 6px;\n      transition: all 0.18s ease;\n      cursor: pointer;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-load-more-btn[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-load-more-btn[_ngcontent-%COMP%] {\n      border-color: #334155;\n      background: #0f172a;\n      color: #94a3b8;\n    }\n\n    .notif-load-more-btn[_ngcontent-%COMP%]:hover {\n      color: #0759d6;\n      background: #dbeeff;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-load-more-btn[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .notif-load-more-btn[_ngcontent-%COMP%]:hover {\n      color: #9ccbff;\n      background: rgba(8, 102, 255, 0.24);\n    }\n\n    \n\n    .notif-footer[_ngcontent-%COMP%] {\n      padding: 11px 16px;\n      border-top: 1px solid #e4e6eb;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-footer[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-footer[_ngcontent-%COMP%] {\n      border-top-color: #3e4042;\n    }\n\n    \n\n    .notif-empty-icon[_ngcontent-%COMP%] {\n      width: 72px;\n      height: 72px;\n      border-radius: 24px;\n      background: #f1f5f9;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .dark[_nghost-%COMP%]   .notif-empty-icon[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .notif-empty-icon[_ngcontent-%COMP%] {\n      background: #1e293b;\n    }\n\n    \n\n    @keyframes _ngcontent-%COMP%_notifFadeIn {\n      from { opacity: 0; }\n      to   { opacity: 1; }\n    }\n\n    @keyframes _ngcontent-%COMP%_notifPopUp {\n      from { transform: translateY(-8px) scale(0.97); opacity: 0; }\n      to   { transform: translateY(0)    scale(1);    opacity: 1; }\n    }\n\n    \n\n    @media (max-width: 767px) {\n      .notif-backdrop[_ngcontent-%COMP%] {\n        background: rgba(15, 23, 42, 0.55);\n        backdrop-filter: blur(4px);\n        -webkit-backdrop-filter: blur(4px);\n      }\n\n      .notif-drawer[_ngcontent-%COMP%] {\n        bottom: 0 !important;\n        left: 0 !important;\n        right: 0 !important;\n        width: 100% !important;\n        max-height: 85vh !important;\n        border-radius: 18px 18px 0 0 !important;\n        animation: notifSheetSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n      }\n\n      @keyframes notifSheetSlideUp {\n        from { transform: translateY(100%); }\n        to   { transform: translateY(0); }\n      }\n    }\n\n    \n\n    html.performance-lite[_nghost-%COMP%]   .notif-backdrop[_ngcontent-%COMP%], html.performance-lite   [_nghost-%COMP%]   .notif-backdrop[_ngcontent-%COMP%], \n   html.performance-lite[_nghost-%COMP%]   .notif-drawer[_ngcontent-%COMP%], html.performance-lite   [_nghost-%COMP%]   .notif-drawer[_ngcontent-%COMP%] {\n      animation: none !important;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotificationPanelComponent, [{
        type: Component,
        args: [{ selector: 'app-notification-panel', standalone: true, imports: [CommonModule], template: `
    @if (panel.isOpen()) {
      <!-- Backdrop -->
      <div
        class="notif-backdrop fixed inset-0 z-[190]"
        (click)="panel.close()"
        aria-hidden="true">
      </div>

      <!-- Main Drawer / Popover Container -->
      <div
        role="dialog"
        aria-label="Trung tâm Thông báo"
        class="notif-drawer fixed z-[200] flex flex-col"
        [ngStyle]="panelPos">

        <!-- Mobile Drag Indicator -->
        <div class="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        <!-- ── Header ── -->
        <div class="notif-header shrink-0">
          <div class="min-w-0">
            <h2 class="font-extrabold text-slate-950 dark:text-slate-50 text-[22px] leading-tight">Thông báo</h2>
            <div class="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              @if (unreadCount() > 0) {
                <span><b class="text-blue-600 dark:text-blue-400">{{ unreadCount() }}</b> thông báo chưa đọc</span>
              } @else {
                <span>Bạn đã xem tất cả thông báo</span>
              }
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            @if (unreadCount() > 0) {
              <button
                (click)="markAllAsRead()"
                class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                       hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400
                       transition-all active:scale-95 flex items-center justify-center"
                title="Đánh dấu tất cả đã đọc">
                <i class="fa-solid fa-check-double text-xs"></i>
              </button>
            }

            @if (totalCount() > 0) {
              <div class="relative notif-actions-wrapper">
                <button
                  (click)="toggleActionsMenu()"
                  class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400
                         hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100
                         transition-all active:scale-90"
                  title="Tùy chọn">
                  <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
                </button>

                @if (showActionsMenu()) {
                  <div class="notif-actions-dropdown">
                    @if (readCount() > 0) {
                      <button (click)="onDeleteRead()" class="notif-action-item">
                        <i class="fa-solid fa-check-double text-emerald-500"></i>
                        <span>Xóa đã đọc ({{ readCount() }})</span>
                      </button>
                    }
                    <button (click)="onDeleteAll()" class="notif-action-item notif-action-item--danger">
                      <i class="fa-solid fa-trash-can text-red-500"></i>
                      <span>Xóa tất cả ({{ totalCount() }})</span>
                    </button>
                  </div>
                }
              </div>
            }

            <button
              (click)="panel.close()"
              class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400
                     hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100
                     transition-all active:scale-90">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- ── Segmented Control Tab Filter Bar ── -->
        <div class="notif-tab-bar shrink-0">
          <div class="notif-tab-container">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                class="notif-tab"
                [class.notif-tab--active]="activeTab() === tab.id">
                <span>{{ tab.label }}</span>
                @if (tab.count() > 0) {
                  <span class="notif-tab-count" [class.notif-tab-count--active]="activeTab() === tab.id">
                    {{ tab.count() }}
                  </span>
                }
              </button>
            }
          </div>
        </div>

        <!-- ── Notification List ── -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          @if (filteredGroups().length === 0) {
            <!-- Empty State -->
            <div class="h-full flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
              <div class="notif-empty-icon">
                <i class="fa-solid text-3xl text-slate-400 dark:text-slate-500" [ngClass]="emptyIcon()"></i>
              </div>
              <div class="max-w-[260px]">
                <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  {{ emptyTitle() }}
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                  {{ emptySubtitle() }}
                </p>
              </div>
            </div>
          } @else {
            <!-- Date Groups -->
            @for (group of filteredGroups(); track group.label) {
              <!-- Sticky date separator -->
              <div class="notif-date-separator">
                <span class="notif-date-label">{{ group.label }}</span>
              </div>

              <!-- Items in group -->
              @for (n of group.items; track n.id) {
                <div
                  (click)="onNotificationClick(n)"
                  class="notif-item group relative"
                  [class.notif-item--unread]="!n.isRead">

                  <div class="notif-item-layout">
                    <!-- Type Icon Container -->
                    <div class="notif-type-icon shrink-0" [ngClass]="getIconClass(n.type)">
                      <i class="fa-solid" [ngClass]="getIcon(n.type)"></i>
                    </div>

                    <!-- Main Body Content -->
                    <div class="notif-item-body">
                      <div class="notif-item-heading">
                        <h4 class="font-bold text-[13px] text-slate-900 dark:text-slate-100 leading-snug"
                            [class.truncate]="!isExpanded(n)">
                          {{ n.title }}
                        </h4>
                        <span class="notif-item-time"
                              [ngClass]="!n.isRead ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'"
                              [title]="getFullDate(n.createdAt)">
                          {{ getTimeAgo(n.createdAt) }}
                        </span>
                      </div>

                      <div class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words"
                           [class.line-clamp-2]="!isExpanded(n)">
                        {{ n.message }}
                      </div>

                      @if (n.message && n.message.length > 90) {
                        <button (click)="toggleExpand(n, $event)"
                                class="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">
                          {{ isExpanded(n) ? 'Ẩn bớt ↑' : 'Xem thêm ↓' }}
                        </button>
                      }

                      <!-- Action Button Chip -->
                      @if (n.actionUrl) {
                        <div class="mt-1.5 flex items-center">
                          <span class="notif-action-chip" [ngClass]="getChipClass(n.type)">
                            <span>{{ getActionLabel(n.type) }}</span>
                            <i class="fa-solid fa-arrow-right text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                          </span>
                        </div>
                      }
                    </div>

                    @if (!n.isRead) {
                      <span class="notif-unread-dot shrink-0 self-center" title="Chưa đọc"></span>
                    }

                    <!-- Quick Hover Action Buttons -->
                    <div class="notif-item-actions">
                      @if (!n.isRead) {
                        <button
                          (click)="markAsRead(n.id!, $event)"
                          class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 flex items-center justify-center transition-all"
                          title="Đánh dấu đã đọc">
                          <i class="fa-solid fa-check text-[10px]"></i>
                        </button>
                      }
                      <button
                        (click)="deleteNotification(n, $event)"
                        class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 flex items-center justify-center transition-all"
                        title="Xoá thông báo">
                        <i class="fa-solid fa-trash-can text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              }
            }

            @if (hasMore()) {
              <div class="p-3">
                <button (click)="loadMore()" class="notif-load-more-btn">
                  <i class="fa-solid fa-chevron-down text-[10px]"></i>
                  <span>Xem thêm {{ totalCount() - displayLimit() }} thông báo</span>
                </button>
              </div>
            }
          }
        </div>

        <!-- ── Footer ── -->
        <div class="notif-footer shrink-0">
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            @if (totalCount() > displayLimit()) {
              Hiển thị {{ notifications().length }} / {{ totalCount() }} thông báo
            } @else {
              {{ totalCount() }} thông báo
            }
          </span>
          <button
            (click)="goToSettings()"
            class="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5">
            <i class="fa-solid fa-gear text-[10px]"></i>
            Cài Đặt Thông Báo
          </button>
        </div>
      </div>
    }
  `, styles: ["\n    /* === Backdrop === */\n    .notif-backdrop {\n      background: transparent;\n      animation: notifFadeIn 0.22s ease-out forwards;\n    }\n\n    /* === Popover Container ===\n     * Desktop: Premium Floating Popover attached below the Header bell.\n     * Dimensions: width 420px, max-height 70vh, border-radius 24px.\n     */\n    .notif-drawer {\n      width: min(400px, calc(100vw - 24px));\n      max-height: min(720px, calc(100vh - 76px));\n      background: #ffffff;\n      border-radius: 16px;\n      border: 1px solid rgba(15, 23, 42, 0.08);\n      box-shadow:\n        0 12px 28px rgba(0, 0, 0, 0.2),\n        0 2px 4px rgba(0, 0, 0, 0.08);\n      animation: notifPopUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n      overflow: hidden;\n    }\n\n    :host-context(.dark) .notif-drawer {\n      background: #242526;\n      border-color: rgba(255, 255, 255, 0.08);\n      box-shadow:\n        0 12px 28px rgba(0, 0, 0, 0.55),\n        0 2px 4px rgba(0, 0, 0, 0.35);\n    }\n\n    /* === Header === */\n    .notif-header {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 16px 16px 10px;\n    }\n\n    /* === Actions Dropdown === */\n    .notif-actions-dropdown {\n      position: absolute;\n      right: 0;\n      top: 100%;\n      margin-top: 6px;\n      width: 200px;\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);\n      padding: 6px;\n      z-index: 50;\n      animation: notifPopUp 0.18s ease-out forwards;\n    }\n\n    :host-context(.dark) .notif-actions-dropdown {\n      background: #1e293b;\n      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);\n    }\n\n    .notif-action-item {\n      width: 100%;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 9px 12px;\n      border-radius: 10px;\n      font-size: 11px;\n      font-weight: 600;\n      color: #475569;\n      transition: background 0.15s ease;\n      cursor: pointer;\n    }\n\n    :host-context(.dark) .notif-action-item {\n      color: #cbd5e1;\n    }\n\n    .notif-action-item:hover {\n      background: #f1f5f9;\n    }\n\n    :host-context(.dark) .notif-action-item:hover {\n      background: #334155;\n    }\n\n    .notif-action-item--danger:hover {\n      background: #fef2f2;\n      color: #ef4444;\n    }\n\n    :host-context(.dark) .notif-action-item--danger:hover {\n      background: rgba(127, 29, 29, 0.3);\n      color: #f87171;\n    }\n\n    /* === Segmented Control Tab Bar === */\n    .notif-tab-bar {\n      padding: 4px 12px 10px;\n      background: transparent;\n    }\n\n    :host-context(.dark) .notif-tab-bar {\n      background: transparent;\n    }\n\n    .notif-tab-container {\n      display: grid;\n      grid-template-columns: repeat(4, minmax(0, 1fr));\n      gap: 2px;\n      background: transparent;\n      width: 100%;\n    }\n\n    .notif-tab {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 3px;\n      min-width: 0;\n      padding: 7px 4px;\n      border-radius: 999px;\n      font-size: 11px;\n      font-weight: 700;\n      color: #64748b;\n      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n      border: none;\n      cursor: pointer;\n      white-space: nowrap;\n    }\n\n    :host-context(.dark) .notif-tab {\n      color: #94a3b8;\n    }\n\n    .notif-tab:hover {\n      background: #f0f2f5;\n      color: #1c1e21;\n    }\n\n    :host-context(.dark) .notif-tab:hover {\n      background: #3a3b3c;\n      color: #f1f5f9;\n    }\n\n    .notif-tab--active {\n      background: #e7f3ff;\n      color: #0866ff;\n      box-shadow: none;\n    }\n\n    :host-context(.dark) .notif-tab--active {\n      background: rgba(8, 102, 255, 0.2);\n      color: #7ab7ff;\n      box-shadow: none;\n    }\n\n    .notif-tab-count {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 15px;\n      height: 15px;\n      padding: 0 3px;\n      border-radius: 999px;\n      font-size: 9px;\n      font-weight: 800;\n      background: rgba(100, 116, 139, 0.15);\n      color: #64748b;\n    }\n\n    .notif-tab-count--active {\n      background: #0866ff;\n      color: #ffffff;\n    }\n\n    /* === Date Separator === */\n    .notif-date-separator {\n      position: sticky;\n      top: 0;\n      z-index: 10;\n      padding: 9px 16px 5px;\n      background: rgba(255, 255, 255, 0.96);\n    }\n\n    :host-context(.dark) .notif-date-separator {\n      background: rgba(36, 37, 38, 0.96);\n    }\n\n    .notif-date-label {\n      font-size: 13px;\n      font-weight: 800;\n      color: #1c1e21;\n    }\n\n    :host-context(.dark) .notif-date-label {\n      color: #e4e6eb;\n    }\n\n    /* === Notification Item === */\n    .notif-item {\n      transition: background-color 0.18s ease;\n      margin: 0 8px 2px;\n      border-radius: 12px;\n      cursor: pointer;\n      overflow: hidden;\n    }\n\n    .notif-item:hover {\n      background: #f0f2f5;\n    }\n\n    :host-context(.dark) .notif-item:hover {\n      background: #3a3b3c;\n    }\n\n    .notif-item--unread {\n      background: #e7f3ff;\n    }\n\n    :host-context(.dark) .notif-item--unread {\n      background: rgba(8, 102, 255, 0.16);\n    }\n\n    .notif-item--unread:hover {\n      background: #dbeeff;\n    }\n\n    :host-context(.dark) .notif-item--unread:hover {\n      background: rgba(8, 102, 255, 0.24);\n    }\n\n    /* === Accent Left Bar === */\n    .notif-accent-bar {\n      display: none;\n    }\n\n    /* === Type Icon Container === */\n    .notif-type-icon {\n      width: 34px;\n      height: 34px;\n      border-radius: 999px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 12px;\n    }\n\n    .notif-item-layout {\n      position: relative;\n      display: flex;\n      align-items: flex-start;\n      gap: 9px;\n      padding: 9px 10px;\n    }\n\n    .notif-item-body {\n      flex: 1 1 auto;\n      min-width: 0;\n    }\n\n    .notif-item-heading {\n      display: grid;\n      grid-template-columns: minmax(0, 1fr) auto;\n      align-items: start;\n      gap: 8px;\n      margin-bottom: 2px;\n    }\n\n    .notif-item-time {\n      padding-top: 2px;\n      white-space: nowrap;\n      font-size: 9.5px;\n      font-weight: 600;\n    }\n\n    .notif-item-actions {\n      position: absolute;\n      top: 7px;\n      right: 7px;\n      display: flex;\n      align-items: center;\n      gap: 3px;\n      padding: 2px;\n      border-radius: 999px;\n      background: rgba(255, 255, 255, 0.96);\n      box-shadow: 0 1px 5px rgba(15, 23, 42, 0.14);\n      opacity: 0;\n      pointer-events: none;\n      transform: translateX(4px);\n      transition: opacity 0.15s ease, transform 0.15s ease;\n    }\n\n    .notif-item:hover .notif-item-actions,\n    .notif-item:focus-within .notif-item-actions {\n      opacity: 1;\n      pointer-events: auto;\n      transform: translateX(0);\n    }\n\n    :host-context(.dark) .notif-item-actions {\n      background: rgba(36, 37, 38, 0.96);\n      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);\n    }\n\n    .notif-unread-dot {\n      width: 8px;\n      height: 8px;\n      border-radius: 999px;\n      background: #0866ff;\n      box-shadow: 0 0 0 3px rgba(8, 102, 255, 0.1);\n    }\n\n    /* === Action Chip Button === */\n    .notif-action-chip {\n      display: inline-flex;\n      align-items: center;\n      gap: 5px;\n      padding: 3px 8px;\n      border-radius: 999px;\n      font-size: 10px;\n      font-weight: 700;\n      border: 1px solid transparent;\n      transition: all 0.18s ease;\n      background: #e7f3ff !important;\n      color: #0866ff !important;\n      border-color: transparent !important;\n    }\n\n    /* === Load More Button === */\n    .notif-load-more-btn {\n      width: 100%;\n      padding: 9px 14px;\n      border-radius: 8px;\n      border: 0;\n      background: #e7f3ff;\n      color: #0866ff;\n      font-size: 11px;\n      font-weight: 700;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 6px;\n      transition: all 0.18s ease;\n      cursor: pointer;\n    }\n\n    :host-context(.dark) .notif-load-more-btn {\n      border-color: #334155;\n      background: #0f172a;\n      color: #94a3b8;\n    }\n\n    .notif-load-more-btn:hover {\n      color: #0759d6;\n      background: #dbeeff;\n    }\n\n    :host-context(.dark) .notif-load-more-btn:hover {\n      color: #9ccbff;\n      background: rgba(8, 102, 255, 0.24);\n    }\n\n    /* === Footer === */\n    .notif-footer {\n      padding: 11px 16px;\n      border-top: 1px solid #e4e6eb;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n    }\n\n    :host-context(.dark) .notif-footer {\n      border-top-color: #3e4042;\n    }\n\n    /* === Empty State Icon === */\n    .notif-empty-icon {\n      width: 72px;\n      height: 72px;\n      border-radius: 24px;\n      background: #f1f5f9;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    :host-context(.dark) .notif-empty-icon {\n      background: #1e293b;\n    }\n\n    /* === Animations === */\n    @keyframes notifFadeIn {\n      from { opacity: 0; }\n      to   { opacity: 1; }\n    }\n\n    @keyframes notifPopUp {\n      from { transform: translateY(-8px) scale(0.97); opacity: 0; }\n      to   { transform: translateY(0)    scale(1);    opacity: 1; }\n    }\n\n    /* === Mobile Native Bottom Sheet === */\n    @media (max-width: 767px) {\n      .notif-backdrop {\n        background: rgba(15, 23, 42, 0.55);\n        backdrop-filter: blur(4px);\n        -webkit-backdrop-filter: blur(4px);\n      }\n\n      .notif-drawer {\n        bottom: 0 !important;\n        left: 0 !important;\n        right: 0 !important;\n        width: 100% !important;\n        max-height: 85vh !important;\n        border-radius: 18px 18px 0 0 !important;\n        animation: notifSheetSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n      }\n\n      @keyframes notifSheetSlideUp {\n        from { transform: translateY(100%); }\n        to   { transform: translateY(0); }\n      }\n    }\n\n    /* Performance Lite override */\n    :host-context(html.performance-lite) .notif-backdrop,\n    :host-context(html.performance-lite) .notif-drawer {\n      animation: none !important;\n    }\n  "] }]
    }], null, { onDocumentClick: [{
            type: HostListener,
            args: ['document:click', ['$event']]
        }], onEsc: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NotificationPanelComponent, { className: "NotificationPanelComponent", filePath: "src/app/shared/components/notification-panel/notification-panel.component.ts", lineNumber: 694 }); })();
//# sourceMappingURL=notification-panel.component.js.map