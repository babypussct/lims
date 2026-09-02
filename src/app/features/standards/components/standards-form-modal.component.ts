import { Component, inject, signal, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReferenceStandard } from '../../../core/models/standard.model';
import { StandardService } from '../standard.service';
import { GoogleDriveService } from '../../../core/services/google-drive.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { generateSlug, UNIT_OPTIONS } from '../../../shared/utils/utils';
import { StandardTagCatalogService } from '../services/standard-tag-catalog.service';
import { sanitizeLegacyTagKeys } from '../services/standard-tag.utils';
import { StandardTagPickerComponent } from './standard-tag-picker.component';
import { isCurrentStandardLifecycle, normalizeInternalId, STANDARD_INTERNAL_ID_PATTERN } from '../../../shared/utils/standard-internal-id';
import { AppModalShellComponent } from '../../../shared/components/ui/modal-shell/modal-shell.component';

@Component({
  selector: 'app-standards-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StandardTagPickerComponent, AppModalShellComponent],
  template: `
      <!-- ADD/EDIT MODAL (3 TABS) -->
      @if (isOpen()) {
         <app-modal-shell
           [title]="std() ? 'Cập nhật chất chuẩn' : 'Thêm chất chuẩn mới'"
           description="Cập nhật thông tin nhận diện, tồn kho, bảo quản và hồ sơ chất chuẩn."
           size="md"
           [closeOnBackdrop]="false"
           (closed)="onClose()"
         >
                    <form modalBody [formGroup]="form" class="space-y-8">
                        
                        <!-- SECTION 1: GENERAL INFO -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">1. Thông Tin Chung</h4>
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên thương mại (Commercial Name) <span class="text-red-500 dark:text-red-400">*</span></label>
                                <input id="stdNameInput" formControlName="name" (input)="onNameChange($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-500/50" placeholder="VD: Sulfadiazine Standard">
                            </div>
                            <!-- NEW: Chemical Name Field -->
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên thay thế (Synonyms)</label>
                                <input formControlName="chemical_name" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-500/50 italic" placeholder="VD: N-(2-pyrimidinyl)benzenesulfonamide">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã sản phẩm (Code)</label><input formControlName="product_code" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số CAS</label><input formControlName="cas_number" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hãng sản xuất</label><input formControlName="manufacturer" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hàm lượng (Purity)</label><input formControlName="purity" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-slate-800" placeholder="VD: 99.5%"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div><label class="text-[10px] font-bold text-fuchsia-700 dark:text-fuchsia-400 uppercase block mb-1">Quy cách (Pack Size)</label><input formControlName="pack_size" class="w-full bg-white dark:bg-slate-800 border border-fuchsia-200 dark:border-fuchsia-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-500/50" placeholder="VD: 10mg"></div>
                                <div><label class="text-[10px] font-bold text-fuchsia-700 dark:text-fuchsia-400 uppercase block mb-1">Số Lô (Lot No.)</label><input formControlName="lot_number" class="w-full bg-white dark:bg-slate-800 border border-fuchsia-200 dark:border-fuchsia-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-500/50" placeholder="VD: BCBW1234"></div>
                            </div>

                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <app-standard-tag-picker
                                    [selectedKeys]="standardSopTags()"
                                    [options]="tagCatalog.selectableOptions()"
                                    [max]="100"
                                    label="Nhãn phương pháp / SOP"
                                    (selectedKeysChange)="standardSopTags.set($event)"
                                />
                                <p class="mt-1 text-[10px] text-slate-400 dark:text-slate-500 italic">Thiết bị như GCMS, GCMSMS, LCMSMS... được suy ra từ nhãn phương pháp, không lưu thành nhãn độc lập.</p>
                            </div>
                        </div>

                        <!-- SECTION 2: STOCK & STORAGE -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">2. Kho & Bảo Quản</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Điều kiện bảo quản</label>
                                    <input formControlName="storage_condition" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500" placeholder="VD: FT, CT, RT...">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Vị trí (Location)</label>
                                    <input formControlName="location" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500" placeholder="Tự động từ ĐK bảo quản (VD: Tủ A)">
                                </div>
                            </div>
                            
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã quản lý nội bộ</label>
                                <input formControlName="internal_id" maxlength="5" autocomplete="off" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 uppercase" placeholder="VD: AA01 hoặc SDHET">
                                <p class="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Mã chuẩn có 4 ký tự, bắt đầu bằng A, B hoặc C; riêng nghiệp vụ SDHET là ngoại lệ được chấp nhận.</p>
                                @if (form.get('internal_id')?.invalid && form.get('internal_id')?.touched) {
                                  <p class="mt-1 text-[10px] font-bold text-red-600 dark:text-red-400">Mã phải có 4 ký tự bắt đầu bằng A, B hoặc C; riêng mã nghiệp vụ SDHET được chấp nhận.</p>
                                }
                            </div>
                            
                            <div class="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/50 grid grid-cols-3 gap-4">
                                <div><label class="text-[10px] font-bold text-fuchsia-800 dark:text-fuchsia-400 uppercase block mb-1">Tồn đầu</label><input type="number" formControlName="initial_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"></div>
                                <div><label class="text-[10px] font-bold text-fuchsia-800 dark:text-fuchsia-400 uppercase block mb-1">Hiện tại</label><input type="number" formControlName="current_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-fuchsia-600 dark:text-fuchsia-400 outline-none text-lg"></div>
                                <div>
                                    <label class="text-[10px] font-bold text-fuchsia-800 dark:text-fuchsia-400 uppercase block mb-1">Đơn vị</label>
                                    <select formControlName="unit" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2.5 text-center font-bold text-slate-800 dark:text-slate-200 outline-none h-[44px]">
                                        @for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: DOCS & EXPIRY -->
                        <div class="space-y-4 fade-in pb-4">
                            <h4 class="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">3. Hồ Sơ & Hạn Dùng</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày nhận (Received)</label>
                                    <input type="date" formControlName="received_date" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 [color-scheme:light] dark:[color-scheme:dark]">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-red-400 dark:text-red-500 uppercase block mb-1">Hạn sử dụng (Expiry)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="date" formControlName="expiry_date" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-2 text-sm font-bold text-red-600 dark:text-red-400 outline-none focus:border-red-500 dark:focus:border-red-500 [color-scheme:light] dark:[color-scheme:dark]" (keydown.enter)="saveStandard(false)">
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500 [color-scheme:light] dark:[color-scheme:dark]"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số Hợp đồng / Dự án</label><input formControlName="contract_ref" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500"></div>
                            </div>
                            
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Tệp CoA (liên kết hoặc tải lên)</label>
                                <div class="flex gap-2">
                                    <input formControlName="certificate_ref" (input)="sanitizeDriveLink($event)" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-blue-600 dark:text-blue-400 underline outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-500" placeholder="Paste URL here..." (keydown.enter)="saveStandard(false)">
                                    @if(auth.currentUser()?.role === 'manager') {
                                        <button type="button" (click)="driveInput.click()" [disabled]="isDriveUploading()" class="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50 border border-blue-200 dark:border-blue-800/50" title="Upload lên Google Drive (15GB free, tự đặt tên)">
                                            @if(isDriveUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> Uploading... } @else { <i class="fa-brands fa-google-drive"></i> Drive }
                                        </button>
                                        <input #driveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="uploadCoaToDrive($event)">
                                    }
                                </div>
                                <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic"><i class="fa-brands fa-google-drive mr-0.5"></i> Nút Drive sẽ tự động tải tệp lên Google Drive, đặt tên theo quy ước và gắn liên kết xem trước. <span class="text-blue-500 dark:text-blue-400">Dung lượng miễn phí 15 GB.</span></p>
                            </div>
                        </div>

                    </form>

                <!-- Footer Actions -->
                <div modalFooter class="flex flex-wrap justify-end gap-3">
                    <button (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                    @if(!std()) {
                        <button (click)="saveStandard(true)" [disabled]="form.invalid || isProcessing()" class="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                            @else { <i class="fa-solid fa-plus"></i> Lưu & Thêm tiếp }
                        </button>
                    }
                    <button (click)="saveStandard(false)" [disabled]="form.invalid || isProcessing()" class="px-6 py-2.5 bg-fuchsia-600 dark:bg-fuchsia-500 hover:bg-fuchsia-700 dark:hover:bg-fuchsia-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                        @else { {{ std() ? 'Lưu thay đổi' : 'Tạo mới' }} }
                    </button>
                </div>
         </app-modal-shell>
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
  googleDriveService = inject(GoogleDriveService);
  auth = inject(AuthService);
  tagCatalog = inject(StandardTagCatalogService);

  isProcessing = signal(false);
  isDriveUploading = signal(false);
  standardSopTags = signal<string[]>([]);
  private originalStandardSopTags: string[] = [];
  unitOptions = UNIT_OPTIONS;

  form: FormGroup = this.fb.group({
      id: [''], name: ['', Validators.required], chemical_name: [''],
      product_code: [''], cas_number: [''], purity: [''], manufacturer: [''], pack_size: [''], lot_number: [''], 
      internal_id: ['', [Validators.required, Validators.pattern(STANDARD_INTERNAL_ID_PATTERN)]], location: [''], storage_condition: [''],
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
                this.originalStandardSopTags = sanitizeLegacyTagKeys(currentStd.sop_tags || []);
                this.standardSopTags.set([...this.originalStandardSopTags]);
            } else {
                this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' }); 
                this.originalStandardSopTags = [];
                this.standardSopTags.set([]);
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

  async uploadCoaToDrive(event: any) {
    if (this.isDriveUploading()) return;
    const file = event.target.files[0];
    if (!file) return;

    this.isDriveUploading.set(true);

    this.googleDriveService.authenticateSync(
        async () => {
            try {
                const stdName = this.form.value.name || 'Unknown';
                const lotNum = this.form.value.lot_number || 'NoLot';
                const fileName = GoogleDriveService.generateFileName(stdName, lotNum, file.name);

                this.toast.show(`Đang tải "${fileName}" lên Google Drive...`);
                const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
                this.form.patchValue({ certificate_ref: previewUrl });
                this.toast.show(`Đã tải tệp lên Google Drive: ${fileName}`);
            } catch (e: any) {
                this.toast.show('Không thể tải tệp lên Google Drive: ' + (e.message || 'Không xác định'), 'error');
            } finally {
                this.isDriveUploading.set(false);
                event.target.value = ''; 
            }
        },
        (err) => {
            this.isDriveUploading.set(false);
            this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
            event.target.value = ''; 
        }
    );
  }

  async saveStandard(keepOpen = false) {
    if (this.isProcessing()) return;
    if (this.form.invalid) { this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error'); return; }
    
    const val = this.form.value;

    val.internal_id = normalizeInternalId(val.internal_id);
    if (!STANDARD_INTERNAL_ID_PATTERN.test(val.internal_id)) {
        this.form.get('internal_id')?.markAsTouched();
        this.toast.show('Mã quản lý nội bộ phải có 4 ký tự bắt đầu bằng A, B hoặc C; riêng mã nghiệp vụ SDHET được chấp nhận.', 'error');
        return;
    }

    if (val.internal_id) {
        const existing = this.allStandards().find(s => 
            normalizeInternalId(s.internal_id) === val.internal_id &&
            isCurrentStandardLifecycle(s) &&
            s.id !== this.form.get('id')?.value
        );
        if (existing) {
            this.toast.show(`Mã quản lý ${val.internal_id} đang được dùng ở chuẩn "${existing.name}". Hệ thống sẽ kiểm tra lại trong giao dịch.`, 'error');
        }
    }

    this.isProcessing.set(true);
    try {
        if (!this.std() && (val.initial_amount || 0) > 0 && (val.current_amount || 0) === 0) {
            val.current_amount = val.initial_amount;
        }

        if (!val.id) val.id = generateSlug(val.name + '_' + Date.now());
        const standardData: ReferenceStandard = {
            ...val as any,
            name: val.name?.trim(),
            internal_id: val.internal_id,
            location: val.location?.trim(),
            sop_tags: [...this.standardSopTags()],
        };
    
        if (this.std()) {
            const originalStd = this.std()!;
            const completesPendingCoaRequest = Boolean(
                originalStd.coa_requested_by &&
                standardData.certificate_ref &&
                standardData.certificate_ref !== originalStd.certificate_ref
            );
            const completedCertificateRef = completesPendingCoaRequest
                ? standardData.certificate_ref!
                : null;
            if (completedCertificateRef) {
                // completeCoaUpload() owns the certificate write + requester clear +
                // canonical Activity event atomically. Keep ordinary metadata edits
                // from leaving a half-completed CoA workflow if dispatch setup fails.
                standardData.certificate_ref = originalStd.certificate_ref;
            }

            await this.stdService.updateStandard(standardData, {
                originalTags: this.originalStandardSopTags,
            });
            if (completedCertificateRef) {
                await this.stdService.completeCoaUpload([originalStd], completedCertificateRef);
            }
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
            this.originalStandardSopTags = [];
            this.standardSopTags.set([]);
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
