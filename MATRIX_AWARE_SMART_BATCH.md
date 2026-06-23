# 📋 GHI NHỚ: Matrix-Aware Smart Batch
> Ngày tạo: 2026-06-23 | Trạng thái: **Đã lên kế hoạch, chờ implement**

---

## 🔴 VẤN ĐỀ CẦN GIẢI QUYẾT

**SOP NAFI6 H-9.16 (TBVTV Trong Nước - GC-MS/MS)** bị thuật toán Smart Batch ưu tiên chọn sai cho **mẫu thực phẩm**.

### Nguyên nhân gốc rễ
SOP `9.16-tbvtv-water` chứa **~120 chỉ tiêu** — là superset của tất cả SOP thực phẩm khác.  
Khi mẫu thực phẩm có target trải rộng nhiều nhóm → không SOP thực phẩm nào đáp ứng đủ → SOP nước nhảy vào cover hết và thắng điểm.

**File bị ảnh hưởng**: [`smart-batch.component.ts#L504-L542`](src/app/features/batch/smart-batch.component.ts)

```
Greedy hiện tại: KHÔNG có nhận thức nền mẫu
→ SOP nước thắng khi task trải rộng nhiều nhóm
```

### Công thức điểm hiện tại (lỗi)
```
score = (covered tasks × 10)
      + (mẫu phủ hoàn toàn × 5)
      - (thiếu hóa chất × 20)
      - (chỉ tiêu thừa × 1)           ← penalty quá nhỏ để loại SOP 120 CT
```

---

## ✅ CÁC QUYẾT ĐỊNH ĐÃ THỐNG NHẤT

| # | Câu hỏi | Quyết định |
|---|---|---|
| Q1 | SOP 9.16 có bị loại hoàn toàn? | **Có — Hard Exclusion khi block chỉ định nền mẫu khác** |
| Q2 | Mặc định khi không chọn nền mẫu? | **Hoạt động như cũ** (`any` — không filter) |
| Q3 | Gán matrixTags thủ công hay script? | **Thủ công qua SOP Editor** (history không bị ảnh hưởng) |
| Q4 | Quản lý danh sách matrix? | **Matrix Master** — giống Target Group Manager |

---

## 🏗️ GIẢI PHÁP TỔNG THỂ

```
Thêm 2 khái niệm mới:
  SOP.matrixTags    = ['water'] | ['food'] | [] (= any)
  JobBlock.matrixType = 'water' | 'food' | undefined (= any)

Luồng Smart Batch mới:
  User chọn nền mẫu 'food' cho block
    → Greedy LOẠI tất cả SOP có matrixTags = ['water']
    → SOP 9.16 không bao giờ được chọn cho mẫu thực phẩm ✅

  User không chọn nền mẫu (any)
    → Hoạt động như cũ — backward compatible ✅
```

---

## 📁 KẾ HOẠCH FILE-BY-FILE (5 Phase)

### ─── PHASE 1: Data Model ───────────────────────────────────────

#### `src/app/core/models/sop.model.ts` [MODIFY]
```typescript
// THÊM interface mới — sau TargetGroup:
export interface MatrixType {
  id: string;           // 'water', 'food', 'soil'...
  name: string;         // 'Nước', 'Thực Phẩm'...
  color?: string;       // '#3b82f6'
  description?: string;
  lastUpdated?: any;
}

// THÊM field vào interface Sop — sau isArchived?:
matrixTags?: string[];  // e.g. ['water'] | ['food'] | undefined (= any)
```

---

### ─── PHASE 2: Matrix Type Service (FILE MỚI) ──────────────────

#### `src/app/features/config/matrix-type.service.ts` [NEW]
- Collection Firestore: `/artifacts/{appId}/matrix_types/`
- Methods: `getAll()`, `save()`, `delete()`, `seedDefaults()`
- `seedDefaults()` tạo 2 bản mặc định nếu collection trống:
  - `{ id: 'water', name: 'Nước', color: '#3b82f6' }`
  - `{ id: 'food', name: 'Thực Phẩm', color: '#22c55e' }`

---

### ─── PHASE 3: Matrix Master UI (FILE MỚI + CÁC FILE SỬA) ─────

#### `src/app/features/config/matrix-type-manager.component.ts` [NEW]
#### `src/app/features/config/matrix-type-manager.component.html` [NEW]
- UI card grid hiển thị các matrix type với badge màu
- Form: id (slug, readonly sau tạo), name, color picker, description
- Auto-gọi `seedDefaults()` khi init
- CRUD đầy đủ với confirm khi xóa

#### `src/app/app.routes.ts` [MODIFY]
```typescript
// Thêm sau route 'master-targets' (dòng ~87):
{
  path: 'matrix-types',
  loadComponent: () => import('./features/config/matrix-type-manager.component')
    .then(m => m.MatrixTypeManagerComponent),
  canActivate: [permissionGuard],
  data: { role: 'manager' }
},
```

#### `src/app/features/config/components/config-general.component.html` [MODIFY]
```html
<!-- Thêm nút trong section Admin Tools, cạnh "Nhóm Chỉ Tiêu": -->
<button (click)="router.navigate(['/matrix-types'])">
  Nền Mẫu Phân Tích → /matrix-types
</button>
```

---

### ─── PHASE 4: SOP Editor ──────────────────────────────────────

#### `src/app/features/sop/editor/sop-editor.component.ts` [MODIFY]

**Thêm:**
```typescript
// Import:
import { MatrixTypeService } from '../../config/matrix-type.service';
import { MatrixType } from '../../../core/models/sop.model';

// Inject + Signals:
matrixTypeService = inject(MatrixTypeService);
availableMatrices = signal<MatrixType[]>([]);
selectedMatrixTags = signal<string[]>([]);

// Trong loadSop() — sau runPreview():
if (this.availableMatrices().length === 0) {
  this.matrixTypeService.getAll().then(m => this.availableMatrices.set(m));
}
this.selectedMatrixTags.set(sop.matrixTags || []);

// Method toggle:
toggleMatrixTag(id: string) {
  this.selectedMatrixTags.update(tags =>
    tags.includes(id) ? tags.filter(t => t !== id) : [...tags, id]
  );
}

// Trong save() — thêm vào Sop object:
matrixTags: this.selectedMatrixTags().length > 0
  ? this.selectedMatrixTags()
  : undefined,
```

#### `src/app/features/sop/editor/sop-editor.component.html` [MODIFY]
```
Thêm section "Nền Mẫu Áp Dụng" trong tab General — sau trường ref.
Hiển thị badge toggle cho từng MatrixType với màu sắc.
Cảnh báo amber nếu không chọn nền mẫu nào.
```

**Sau khi hoàn thành Phase 4**: Mở SOP `9.16-tbvtv-water` → chọn "Nước" → Save.

---

### ─── PHASE 5: Smart Batch Core ───────────────────────────────

#### `src/app/features/batch/smart-batch.component.ts` [MODIFY]

**5A. Import:**
```typescript
import { MatrixTypeService } from '../config/matrix-type.service';
import { MatrixType } from '../../core/models/sop.model';
```

**5B. Interface `AnalysisTask` — thêm field (dòng 33–38):**
```typescript
matrixType?: string;  // kế thừa từ JobBlock
```

**5C. Interface `JobBlock` — thêm field (dòng 23–31):**
```typescript
matrixType?: string;  // 'water' | 'food' | undefined (= any)
```

**5D. Class body:**
```typescript
matrixTypeService = inject(MatrixTypeService);
availableMatrices = signal<MatrixType[]>([]);
// Trong constructor: this.matrixTypeService.getAll().then(m => this.availableMatrices.set(m));
```

**5E. Methods helpers:**
```typescript
updateBlockMatrix(index: number, val: string) { ... }
getMatrixLabel(id?: string): string { ... }
getMatrixColor(id?: string): string { ... }
```

**5F. `addBlock()` — thêm `matrixType: undefined` vào block mới**

**5G. `analyzePlan()` — gắn `matrixType` khi push task (dòng ~487):**
```typescript
allTasks.push({ sample, targetId, targetName: tName, covered: false,
  matrixType: block.matrixType });  // ← THÊM
```

**5H. GREEDY LOOP — thay thế candidates logic (dòng 504–542):**

```typescript
// THAY scoring cũ bằng:
const sopMatrices = sop.matrixTags || [];  // [] = universal

// MATRIX HARD FILTER — lọc trước khi score:
const coverableTasks = remainingTasks.filter(t => {
  if (!sopTargetIds.has(t.targetId)) return false;  // SOP không có target
  if (sopMatrices.length === 0) return true;          // SOP universal → pass
  if (!t.matrixType) return true;                     // Task any → pass
  return sopMatrices.includes(t.matrixType);          // Hard match
});

// SCORING CẢI TIẾN:
let score = 0;
score += coverableTasks.length * 10;                              // Coverage
// ... completeness bonus +5 ...
const uniqueCovered = new Set(coverableTasks.map(t=>t.targetId)).size;
score += (uniqueCovered / sop.targets.length) * 30;              // ← MỚI: Coverage Ratio
score -= missingStock * 20;                                       // Stock penalty
score -= (sop.targets.length - uniqueCovered) * 1;              // Extraneous
```

#### `src/app/features/batch/smart-batch.component.html` [MODIFY]
```
Thêm dropdown "Nền mẫu" trong mỗi JobBlock card (Step 1).
Options: load từ availableMatrices() + option "⚪ Bất kỳ (mặc định)".
Badge màu hiển thị nền mẫu đã chọn.
Badge matrix trên Batch result card (dựa vào sop.matrixTags[0]).
```

---

## 📊 TỔNG HỢP SCOPE

```
File MỚI (2):
  ├─ src/app/features/config/matrix-type.service.ts
  └─ src/app/features/config/matrix-type-manager.component.ts (.html)

File SỬA (6):
  ├─ src/app/core/models/sop.model.ts                           [Phase 1]
  ├─ src/app/app.routes.ts                                      [Phase 3]
  ├─ src/app/features/config/components/config-general.*        [Phase 3]
  ├─ src/app/features/sop/editor/sop-editor.component.ts        [Phase 4]
  ├─ src/app/features/sop/editor/sop-editor.component.html      [Phase 4]
  ├─ src/app/features/batch/smart-batch.component.ts            [Phase 5]
  └─ src/app/features/batch/smart-batch.component.html          [Phase 5]
```

---

## ✔️ CHECKLIST THỰC HIỆN

### Phase 1 — Data Model
- [ ] Thêm `interface MatrixType` vào `sop.model.ts`
- [ ] Thêm `matrixTags?: string[]` vào `interface Sop`
- [ ] Build check: không lỗi TypeScript

### Phase 2 — Service
- [ ] Tạo `matrix-type.service.ts`
- [ ] Test `seedDefaults()` → Firestore có 2 docs trong `/matrix_types/`

### Phase 3 — UI Matrix Master
- [ ] Tạo `matrix-type-manager.component.ts + .html`
- [ ] Thêm route `/matrix-types` vào `app.routes.ts`
- [ ] Thêm nút vào `config-general.component.html`
- [ ] Test: CRUD hoạt động tại `/matrix-types`

### Phase 4 — SOP Editor
- [ ] Import service + signals vào `sop-editor.component.ts`
- [ ] Thêm `loadSop()` logic
- [ ] Thêm `toggleMatrixTag()` method
- [ ] Thêm `matrixTags` vào `save()` object
- [ ] Thêm UI section vào `sop-editor.component.html`
- [ ] **QUAN TRỌNG**: Mở SOP `9.16-tbvtv-water` → gán `matrixTags: ['water']` → Save

### Phase 5 — Smart Batch
- [ ] Thêm `matrixType` vào `AnalysisTask` interface
- [ ] Thêm `matrixType` vào `JobBlock` interface
- [ ] Inject + load MatrixTypeService
- [ ] Thêm helper methods (`updateBlockMatrix`, `getMatrixLabel`, `getMatrixColor`)
- [ ] Sửa `addBlock()` thêm `matrixType: undefined`
- [ ] Sửa `analyzePlan()` gắn matrixType vào task khi push
- [ ] **QUAN TRỌNG**: Thay thế scoring/filter logic trong greedy loop
- [ ] Thêm dropdown nền mẫu vào HTML
- [ ] Thêm badge matrix vào batch card

### Kiểm Tra Cuối
- [ ] Block `matrixType = 'food'` → SOP 9.16 **KHÔNG xuất hiện**
- [ ] Block `matrixType = 'water'` → **CHỈ** SOP có `matrixTags ∋ 'water'`
- [ ] Block không chọn nền mẫu → hành vi **giống cũ hoàn toàn**

---

## 🗃️ THÔNG TIN FIRESTORE

| Collection | Path | Mô tả |
|---|---|---|
| Matrix Types | `/artifacts/{appId}/matrix_types/` | Danh sách nền mẫu |
| SOPs | `/artifacts/{appId}/sops/` | `matrixTags` field mới |
| SOP History | `/artifacts/{appId}/sops/{id}/history/` | **Không cần update** |

> **Lưu ý**: History records thiếu `matrixTags` → `undefined` → tương đương `any`.  
> Smart Batch chỉ đọc SOPs active (`!isArchived`) → không đọc history → an toàn.

---

## 🔗 FILES LIÊN QUAN

| File | Vai trò |
|---|---|
| [`smart-batch.component.ts`](src/app/features/batch/smart-batch.component.ts) | Core logic cần sửa (Phase 5) |
| [`sop.model.ts`](src/app/core/models/sop.model.ts) | Data model (Phase 1) |
| [`sop-editor.component.ts`](src/app/features/sop/editor/sop-editor.component.ts) | SOP Editor (Phase 4) |
| [`target.service.ts`](src/app/features/targets/target.service.ts) | **Pattern tham khảo** cho MatrixTypeService |
| [`app.routes.ts`](src/app/app.routes.ts) | Routing (Phase 3) |
| [`sop-9.16.json`](sop-9.16.json) | Dữ liệu SOP 9.16 (120 chỉ tiêu) |

---

*Ghi chú cuối: Sau khi implement xong Phase 5, cần gán `matrixTags` cho TẤT CẢ các SOP hiện có qua SOP Editor để hệ thống hoạt động chính xác nhất.*
