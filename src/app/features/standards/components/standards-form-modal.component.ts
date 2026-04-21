import { Component, inject, signal, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { StandardService } from '../standard.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { GoogleDriveService } from '../../../core/services/google-drive.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { generateSlug, UNIT_OPTIONS } from '../../../shared/utils/utils';

@Component({
  selector: 'app-standards-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
      <!-- ADD/EDIT MODAL (3 TABS) -->
      @if (isOpen()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-flask-vial text-indigo-600 dark:text-indigo-400"></i>
                        {{ std() ? 'Cập nhật Chuẩn' : 'Thêm Chuẩn Mới' }}
                    </h3>
                    <button (click)="onClose()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <form [formGroup]="form" class="space-y-8">
                        
                        <!-- SECTION 1: GENERAL INFO -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">1. Thông tin chung</h4>
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên Chuẩn <span class="text-red-500 dark:text-red-400">*</span></label>
                                <input id="stdNameInput" formControlName="name" (input)="onNameChange($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: Sulfadiazine Standard">
                            </div>
                            <!-- NEW: Chemical Name Field -->
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên hóa học / Tên khác</label>
                                <input formControlName="chemical_name" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 italic" placeholder="VD: N-(2-pyrimidinyl)benzenesulfonamide">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã sản phẩm (Code)</label><input formControlName="product_code" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số CAS</label><input formControlName="cas_number" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hãng sản xuất</label><input formControlName="manufacturer" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hàm lượng (Purity)</label><input formControlName="purity" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800" placeholder="VD: 99.5%"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Quy cách (Pack Size)</label><input formControlName="pack_size" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: 10mg"></div>
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Số Lô (Lot No.)</label><input formControlName="lot_number" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: BCBW1234"></div>
                            </div>
                        </div>

                        <!-- SECTION 2: STOCK & STORAGE -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">2. Kho & Bảo quản</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Điều kiện bảo quản</label>
                                    <input formControlName="storage_condition" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="VD: FT, CT, RT...">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Vị trí (Location)</label>
                                    <input formControlName="location" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Tự động từ ĐK bảo quản (VD: Tủ A)">
                                </div>
                            </div>
                            
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã Quản lý (Internal ID)</label>
                                <input formControlName="internal_id" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 uppercase" placeholder="VD: AA01">
                            </div>
                            
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 grid grid-cols-3 gap-4">
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Tồn đầu</label><input type="number" formControlName="initial_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"></div>
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Hiện tại</label><input type="number" formControlName="current_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-indigo-600 dark:text-indigo-400 outline-none text-lg"></div>
                                <div>
                                    <label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Đơn vị</label>
                                    <select formControlName="unit" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2.5 text-center font-bold text-slate-800 dark:text-slate-200 outline-none h-[44px]">
                                        @for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: DOCS & EXPIRY -->
                        <div class="space-y-4 fade-in pb-4">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">3. Hồ sơ & Hạn dùng</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày nhận (Received)</label>
                                    <input type="date" formControlName="received_date" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-red-400 dark:text-red-500 uppercase block mb-1">Hạn sử dụng (Expiry)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="date" formControlName="expiry_date" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-2 text-sm font-bold text-red-600 dark:text-red-400 outline-none focus:border-red-500 dark:focus:border-red-500 [color-scheme:light] dark:[color-scheme:dark]" (keydown.enter)="saveStandard(false)">
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số Hợp đồng / Dự án</label><input formControlName="contract_ref" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500"></div>
                            </div>
                            
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">COA File (Link/Upload)</label>
                                <div class="flex gap-2">
                                    <input formControlName="certificate_ref" (input)="sanitizeDriveLink($event)" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-blue-600 dark:text-blue-400 underline outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Paste URL here..." (keydown.enter)="saveStandard(false)">
                                    @if(auth.currentUser()?.role === 'manager') {
                                        <button type="button" (click)="uploadInput.click()" [disabled]="isUploading() || isDriveUploading()" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50" title="Upload lên Firebase Storage">
                                            @if(isUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-cloud-arrow-up"></i> Upload }
                                        </button>
                                        <input #uploadInput type="file" class="hidden" (change)="uploadCoaFile($event)">
                                        <button type="button" (click)="triggerDriveUpload(driveInput)" [disabled]="isDriveUploading() || isUploading()" class="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50 border border-blue-200 dark:border-blue-800/50" title="Upload lên Google Drive (15GB free, tự đặt tên)">
                                            @if(isDriveUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> Uploading... } @else { <i class="fa-brands fa-google-drive"></i> Drive }
                                        </button>
                                        <input #driveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="uploadCoaToDrive($event)">
                                    }
                                </div>
                                <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic"><i class="fa-brands fa-google-drive mr-0.5"></i> Nút Drive: upload tự động lên Google Drive, đặt tên theo chuẩn, gán link preview. <span class="text-blue-500 dark:text-blue-400">15GB free!</span></p>
                            </div>
                        </div>

                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                    @if(!std()) {
                        <button (click)="saveStandard(true)" [disabled]="form.invalid || isProcessing()" class="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                            @else { <i class="fa-solid fa-plus"></i> Lưu & Thêm tiếp }
                        </button>
                    }
                    <button (click)="saveStandard(false)" [disabled]="form.invalid || isProcessing()" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                        @else { {{ std() ? 'Lưu Thay Đổi' : 'Tạo Mới' }} }
                    </button>
                </div>
            </div>
         </div>
      }
  `
})
export class StandardsFormModalComponent {
  std = input<ReferenceStandard | null>(null);
  isOpen = input<boolean>(false);
  allStandards = input<ReferenceStandard[]>([]); // To check for internal_id existence
  
  closeModal = output<void>();

  private fb = inject(FormBuilder);
  stdService = inject(StandardService);
  toast = inject(ToastService);
  firebaseService = inject(FirebaseService);
  googleDriveService = inject(GoogleDriveService);
  auth = inject(AuthService);

  isProcessing = signal(false);
  isUploading = signal(false);
  isDriveUploading = signal(false);
  unitOptions = UNIT_OPTIONS;

  form: FormGroup = this.fb.group({
      id: [''], name: ['', Validators.required], chemical_name: [''],
      product_code: [''], cas_number: [''], purity: [''], manufacturer: [''], pack_size: [''], lot_number: [''], 
      internal_id: [''], location: [''], storage_condition: [''],
      initial_amount: [0, [Validators.required, Validators.min(0)]],
      current_amount: [0, [Validators.required, Validators.min(0)]],
      unit: ['mg', Validators.required],
      expiry_date: [''], received_date: [''], date_opened: [''], contract_ref: [''], certificate_ref: ['']
  });

  constructor() {
    effect(() => {
        if (this.isOpen()) {
            const currentStd = this.std();
            if (currentStd) {
                this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
                this.form.patchValue(currentStd as any); 
            } else {
                this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
            }
        }
    });

    // Auto-fill Location based on Storage Condition
    this.form.get('storage_condition')?.valueChanges.subscribe(val => {
        if (!val) return;
        const lower = val.toLowerCase();
        let loc = '';
        if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20')) loc = 'Tủ A';
        else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8')) loc = 'Tủ B';
        else if (lower.includes('rt') || lower.includes('thường')) loc = 'Tủ C';
        
        if (loc && this.form.get('location')?.value !== loc) {
            this.form.patchValue({ location: loc });
        }
    });
  }

  onClose() {
    if (!this.isProcessing()) {
        this.closeModal.emit();
    }
  }

  onNameChange(event: any) { 
    if (!this.std()) { 
        const lot = this.form.get('lot_number')?.value || ''; 
        this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) }); 
    } 
  }

  sanitizeDriveLink(event: any) {
    const val = event.target.value;
    if (!val) return;
    if (val.includes('drive.google.com') && val.includes('/view')) {
        const newVal = val.replace('/view', '/preview');
        this.form.patchValue({ certificate_ref: newVal }, { emitEvent: false });
    }
  }

  async uploadCoaFile(event: any) {
    if (this.isUploading()) return;
    const file = event.target.files[0];
    if (!file) return;
    this.isUploading.set(true);
    try {
        const url = await this.firebaseService.uploadFile('coa', file);
        this.form.patchValue({ certificate_ref: url });
        this.toast.show('Upload COA thành công!');
    } catch (e: any) { 
        this.toast.show('Upload lỗi: ' + (e.message || 'Unknown'), 'error'); 
    } finally { 
        this.isUploading.set(false);
        event.target.value = ''; 
    }
  }

  triggerDriveUpload(inputEl: HTMLInputElement) {
      this.googleDriveService.authenticateSync(
          () => {
              inputEl.click();
          },
          (err) => {
              this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
          }
      );
  }

  async uploadCoaToDrive(event: any) {
    if (this.isDriveUploading()) return;
    const file = event.target.files[0];
    if (!file) return;

    this.isDriveUploading.set(true);
    try {
        const stdName = this.form.value.name || 'Unknown';
        const lotNum = this.form.value.lot_number || 'NoLot';
        const fileName = GoogleDriveService.generateFileName(stdName, lotNum, file.name);

        this.toast.show(`Đang upload "${fileName}" lên Google Drive...`);
        const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
        this.form.patchValue({ certificate_ref: previewUrl });
        this.toast.show(`Upload Drive thành công! File: ${fileName}`);
    } catch (e: any) {
        this.toast.show('Upload Drive lỗi: ' + (e.message || 'Không xác định'), 'error');
    } finally {
        this.isDriveUploading.set(false);
        event.target.value = ''; 
    }
  }

  async saveStandard(keepOpen = false) {
    if (this.isProcessing()) return;
    if (this.form.invalid) { this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error'); return; }
    
    const val = this.form.value;

    if (val.internal_id && val.internal_id !== 'SDHET') {
        const existing = this.allStandards().find(s => 
            s.internal_id?.toLowerCase() === val.internal_id?.toLowerCase() && 
            s.id !== this.form.get('id')?.value
        );
        if (existing) {
            this.toast.show(`Cảnh báo: Mã quản lý ${val.internal_id} đã tồn tại ở chuẩn "${existing.name}".`, 'info');
        }
    }

    this.isProcessing.set(true);
    try {
        if (!this.std() && (val.initial_amount || 0) > 0 && (val.current_amount || 0) === 0) {
            val.current_amount = val.initial_amount;
        }

        if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
        const standardData: ReferenceStandard = { ...val as any, name: val.name?.trim(), internal_id: val.internal_id?.toUpperCase().trim(), location: val.location?.trim() };
    
        if (this.std()) {
            await this.stdService.updateStandard(standardData);
            this.toast.show('Cập nhật chuẩn thành công!', 'success');
        } else {
            await this.stdService.addStandard(standardData);
            this.toast.show('Thêm chuẩn mới thành công!', 'success');
        }
        
        if (keepOpen && !this.std()) {
            this.form.reset({
                initial_amount: 0,
                current_amount: 0,
                unit: val.unit || 'mg',
                storage_condition: val.storage_condition,
                location: val.location,
                manufacturer: val.manufacturer,
                received_date: val.received_date
            });
        } else {
            this.closeModal.emit();
        }
    } catch (e: any) { 
        this.toast.show('Lỗi: ' + e.message, 'error'); 
    } finally {
        this.isProcessing.set(false);
    }
  }
}
