$target = 'c:\Users\GCMS\Documents\GitHub\lims\src\app\features\results\sops\sop-nhom-lan-huu-co-gc-msms-copy-1768036876719\sop-nhom-lan-huu-co-gc-msms-copy-1768036876719-entry.component.ts'
$src = [System.IO.File]::ReadAllText($target)

$html2 = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_html2.txt')
$ts = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_ts.txt')
$tsInit = [System.IO.File]::ReadAllText('c:\Users\GCMS\Documents\GitHub\lims\scratch_ts_init.txt')

# 1. Replace Top HTML
$oldTop = @"
  template: ``
    <div class="space-y-6 animate-fade-in">
      
      <!-- 1. Metadata Form & Checkboxes -->
"@.Replace("``", "`"")
$newTop = @"
  template: ``
    <div class="space-y-6 animate-fade-in">
      
      <!-- Form Selection Switcher -->
      <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm mb-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider">Hình thức in kết quả:</span>
          <div class="inline-flex bg-slate-100 dark:bg-slate-955 p-1 rounded-xl border border-slate-200 dark:border-slate-800 select-none items-center shadow-3xs">
            <button type="button"
                    (click)="setPrintFormType('formCheck')"
                    [class]="draft.page1Data['printFormType'] === 'formCheck'
                      ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' 
                      : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-850 dark:hover:text-slate-250 transition duration-155'">
              FORM CHECK (Trang 9-10)
            </button>
            <button type="button"
                    (click)="setPrintFormType('formDon')"
                    [class]="draft.page1Data['printFormType'] === 'formDon'
                      ? 'px-3.5 py-2 text-xs font-black rounded-lg bg-violet-600 text-white shadow-xs transition duration-150 active:scale-95' 
                      : 'px-3.5 py-2 text-xs font-bold rounded-lg text-slate-550 hover:text-slate-850 dark:hover:text-slate-250 transition duration-155'">
              FORM ĐƠN (Trang 15)
            </button>
          </div>
        </div>
      </div>
      
      <!-- TAB 1: COMPOUND RESULTS GRID -->
      <div *ngIf="draft.page1Data['printFormType'] === 'formCheck'" class="space-y-6">
        
      <!-- 1. Metadata Form & Checkboxes -->
"@.Replace("``", "`"")

$src = $src.Replace($oldTop, $newTop)

# 2. Replace Bottom HTML
$oldBottom = @"
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ``
"@.Replace("``", "`"")
$newBottom = @"
            </tbody>
          </table>
        </div>
      </div>
    </div>

$html2
    </div>
  ``
"@.Replace("``", "`"")

$src = $src.Replace($oldBottom, $newBottom)

# 3. Inject TS Methods
$tsMarker = "  async ngOnInit() {"
$newTsMarker = $ts + "`r`n`r`n  async ngOnInit() {"
$src = $src.Replace($tsMarker, $newTsMarker)

# 4. Inject ngOnInit init block
$initMarker = "    if (this.config.checkboxLines) {"
$src = $src.Replace($initMarker, $tsInit + "`r`n`r`n" + $initMarker)

[System.IO.File]::WriteAllText($target, $src)
