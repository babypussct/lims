import re

with open('src/app/features/dashboard/statistics.component.ts', 'r') as f:
    content = f.read()

# Add ExportModalComponent to imports
if 'ExportModalComponent' not in content:
    content = content.replace(
        "import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';",
        "import { DateRangeFilterComponent } from '../../shared/components/date-range-filter/date-range-filter.component';\nimport { ExportModalComponent } from '../../shared/components/export-modal/export-modal.component';"
    )
    content = content.replace(
        "imports: [CommonModule, FormsModule, DateRangeFilterComponent],",
        "imports: [CommonModule, FormsModule, DateRangeFilterComponent, ExportModalComponent],"
    )

# The HTML to replace starts at `<!-- GLOBAL EXPORT MODAL -->`
start_marker = "<!-- GLOBAL EXPORT MODAL -->"
end_marker = "  `\n})"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    modal_html = content[start_idx:end_idx]
    
    # We want to extract the "Scrollable Content" part, exactly from:
    # <!-- Quick Presets -->
    # up to the end of <!-- 5. Standards Health --> and <!-- Cover sheet info -->
    # But wait, we can just replace the whole modal HTML with <app-export-modal>
    
    # Let's extract the presets and sections
    presets_start = modal_html.find('<!-- Quick Presets -->')
    sections_end = modal_html.find('<!-- Progress complete -->')
    
    if presets_start != -1 and sections_end != -1:
        inner_content = modal_html[presets_start:sections_end]
        
        new_modal = f"""<!-- GLOBAL EXPORT MODAL -->
    @if (showGlobalExportModal()) {{
        <app-export-modal
            title="Xuất Báo cáo Tổng hợp"
            [dateRangeText]="startDate() + ' → ' + endDate()"
            [subtitle]="selectedSopId() !== 'all' ? 'SOP: ' + getSelectedSopName() : ''"
            [isExporting]="isExporting()"
            [isCompleted]="exportProgress().cover === 'done'"
            [footerText]="getSelectedSheetsCount() + ' sheet(s) sẽ được xuất'"
            (close)="showGlobalExportModal.set(false)"
            (execute)="runGlobalExport()"
            [isSubmitDisabled]="getSelectedSheetsCount() === 0">
            
            {inner_content}
            
        </app-export-modal>
    }}
"""
        content = content[:start_idx] + new_modal + content[end_idx:]

with open('src/app/features/dashboard/statistics.component.ts', 'w') as f:
    f.write(content)
