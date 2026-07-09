const fs = require('fs');
let code = fs.readFileSync('src/app/features/results/result-entry.component.ts', 'utf8');

code = code.replace(/activeFilter = signal<string>\('ALL'\);/, 'activeFilter = signal<string>(\'ALL\');\n  samplesPerReport = signal<number | null>(null);');

const triggerStart = code.indexOf('async triggerPublishReport() {');
const triggerEnd = code.indexOf('async triggerUnlockToEdit() {');

const newTrigger = `async triggerPublishReport() {
    if (this.isPublishing()) return;
    
    const currentRun = this.run();
    const currentDraft = this.draft();
    const currentConf = this.config();
    if (!currentRun || !currentDraft || !currentConf) return;

    if (this.isReadOnly()) {
      if (currentDraft.status !== 'completed') {
        this.toast.show('Mẻ chạy đang bị khóa bởi người khác, không thể xuất báo cáo mới!', 'error');
        return;
      }
    }

    this.isPublishing.set(true);

    try {
      this.autoSaveStatus.set('saving');
      this.autoSaveStatus.set('synced');

      const activeFilter = this.activeFilter();
      const key = this.configKey();
      
      // 1. Get all included samples based on activeFilter
      const allIncludedSamples = (currentRun.sampleList || []).filter((s) => {
        const resObj = currentDraft.resultData[s] || {};
        const startsWithLetter = /^[a-zA-Z]/.test(s);
        const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
        const isSelected = resObj['selected'] !== false;
        const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
        return isSelected && matchesFilter;
      });

      if (allIncludedSamples.length === 0) {
        this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
        this.isPublishing.set(false);
        return;
      }

      // 2. Chunking
      const chunkSize = this.samplesPerReport() || allIncludedSamples.length;
      const chunks = [];
      for (let i = 0; i < allIncludedSamples.length; i += chunkSize) {
        chunks.push(allIncludedSamples.slice(i, i + chunkSize));
      }

      let lastResult = null;

      // 3. Process each chunk
      for (const chunk of chunks) {
        // Clone draft and set selected=false for non-chunk samples
        const chunkDraft = JSON.parse(JSON.stringify(currentDraft));
        (currentRun.sampleList || []).forEach((s) => {
          if (!chunk.includes(s)) {
            if (!chunkDraft.resultData[s]) chunkDraft.resultData[s] = {};
            chunkDraft.resultData[s].selected = false;
          }
        });

        let prefixForReport = activeFilter === 'ALL' ? 'ALL' : activeFilter;
        if (activeFilter === 'ALL' && chunk.length > 0) {
          const detectedPrefixes = new Set();
          chunk.forEach((s) => {
            const startsWithLetter = /^[a-zA-Z]/.test(s);
            detectedPrefixes.add(startsWithLetter ? s.charAt(0).toUpperCase() : '');
          });
          if (detectedPrefixes.size === 1) {
            prefixForReport = Array.from(detectedPrefixes)[0];
          }
        }

        let reportPayload = null;

        if (key === 'trifluralin-gcms') {
          reportPayload = buildTrifluralinPdfPayload(chunkDraft, currentRun, activeFilter, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else if (key === 'tbvtv-thuc-pham-gcmsms') {
          const isRutGon = chunkDraft.page1Data['printFormType'] === 'formRutGon';
          if (isRutGon) {
            const shortConf = { ...ANGULAR_SOP_CONFIG['tbvtv-thuc-pham-gcmsms-rut-gon'], id: 'tbvtv-thuc-pham-gcmsms-rut-gon' };
            reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, shortConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
            reportPayload.sopId = 'tbvtv-thuc-pham-gcmsms-rut-gon';
            reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formRutGon', sourceSopId: chunkDraft.sopId || currentRun.sopId, templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formRutGon, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formRutGon };
          } else {
            reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
            reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formDayDu', templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formDayDu, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formDayDu };
          }
        } else if (key === 'lan-huu-co' || key === 'chlor-huu-co' || key === 'nhom-cuc' || key === 'nhom-i' || currentConf.formType === 'type3b') {
          reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        } else if (key === 'fipronil-chlorpyrifos') {
          reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        } else if (key === 'dichlorvos-gcms') {
          reportPayload = buildDichlorvosPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else if (key === 'chloroform-gcms') {
          reportPayload = buildChloroformPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
        } else {
          reportPayload = buildDefaultSopPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
        }

        const result = await this.resultService.publishReport(this.requestId, chunkDraft, reportPayload, prefixForReport, chunk);
        lastResult = result;
      }

      if (lastResult && lastResult.success) {
        this.draft.update((d) => d ? { ...d, status: lastResult.newStatus || 'completed', version: (d.version || 0) + 1 } : null);
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
        const url = lastResult.pdfViewUrl || lastResult.pdfUrl;
        if (url) {
          this.openPdfPreview(url);
        } else {
          this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
        }
      }
    } finally {
      this.isPublishing.set(false);
    }
  }

  /**
   * Hủy xuất bản kết quả (Mở khóa chỉnh sửa)
   */
`;

code = code.substring(0, triggerStart) + newTrigger + code.substring(triggerEnd + 37);

fs.writeFileSync('src/app/features/results/result-entry.component.ts', code);
console.log('done refactor');
