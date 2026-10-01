// Same renderer styles in preview and output.
export const DAILY_PRINT_RENDERER_CSS = `
      /* Adaptive batch table: print renderer độc lập với card màn hình */
      .a4-html-root .cl-adaptive-root {
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #0f172a !important;
        background: #ffffff !important;
      }

      .a4-html-root .cl-print-document {
        display: block !important;
        width: 100% !important;
      }

      .a4-html-root .cl-print-header {
        display: flex !important;
        align-items: baseline !important;
        justify-content: space-between !important;
        gap: 8px !important;
        padding: 0 0 4mm !important;
        border-bottom: 1.5px solid #334155 !important;
        margin-bottom: 3mm !important;
      }

      .a4-html-root .cl-print-header h2 {
        margin: 0 !important;
        font-size: 12pt !important;
        line-height: 1.2 !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
      }

      .a4-html-root .cl-print-header div {
        font-size: 9pt !important;
        white-space: nowrap !important;
      }

      .a4-html-root .cl-print-list-layout,
      .a4-html-root .cl-print-compact-layout {
        display: none !important;
      }

      .a4-html-root .cl-print-mode-list .cl-print-list-layout {
        display: block !important;
      }

      .a4-html-root .cl-print-mode-compact .cl-print-compact-layout {
        display: block !important;
      }

      .a4-html-root .cl-print-compact-page {
        display: block !important;
        position: relative !important;
        box-sizing: border-box !important;
        break-inside: avoid-page !important;
        page-break-inside: avoid !important;
        break-after: page !important;
        page-break-after: always !important;
      }

      .a4-html-root.a4-portrait .cl-print-compact-page {
        height: 265mm !important;
      }

      .a4-html-root.a4-landscape .cl-print-compact-page {
        height: 178mm !important;
      }

      .a4-html-root .cl-print-compact-page-last {
        break-after: auto !important;
        page-break-after: auto !important;
      }

      .a4-html-root .cl-print-compact-columns {
        display: grid !important;
        align-items: start !important;
        gap: 4mm !important;
        box-sizing: border-box !important;
      }

      .a4-html-root.a4-portrait .cl-print-compact-columns {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .a4-html-root.a4-landscape .cl-print-compact-columns {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }

      .a4-html-root .cl-print-compact-column {
        display: block !important;
        min-width: 0 !important;
      }

      .a4-html-root .cl-print-compact-card {
        display: block !important;
        width: 100% !important;
        margin: 0 0 4mm !important;
        border: 1px solid #94a3b8 !important;
        border-radius: 2.5mm !important;
        overflow: hidden !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        background: white !important;
        font-size: 8pt !important;
        line-height: 1.3 !important;
      }

      .a4-html-root .cl-print-compact-head {
        display: flex !important;
        align-items: flex-start !important;
        gap: 2mm !important;
        padding: 2.2mm !important;
        border-bottom: 1px solid #cbd5e1 !important;
        background: #f8fafc !important;
      }

      .a4-html-root .cl-print-compact-index {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 5mm !important;
        height: 5mm !important;
        flex: 0 0 5mm !important;
        border-radius: 50% !important;
        color: white !important;
        background: #2563eb !important;
        font-size: 7pt !important;
        font-weight: 800 !important;
      }

      .a4-html-root .cl-print-compact-title {
        min-width: 0 !important;
        flex: 1 1 auto !important;
        font-size: 8.5pt !important;
        font-weight: 800 !important;
        overflow-wrap: anywhere !important;
      }

      .a4-html-root .cl-print-compact-title small {
        display: block !important;
        margin-top: 0.7mm !important;
        color: #64748b !important;
        font-size: 6.5pt !important;
        font-weight: 600 !important;
      }

      .a4-html-root .cl-print-compact-group {
        padding: 2.2mm !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .a4-html-root .cl-print-compact-group + .cl-print-compact-group {
        border-top: 1px dashed #cbd5e1 !important;
      }

      .a4-html-root .cl-print-compact-label {
        margin-bottom: 0.7mm !important;
        color: #64748b !important;
        font-size: 6.7pt !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.03em !important;
      }

      .a4-html-root .cl-print-compact-samples {
        margin-bottom: 1.5mm !important;
        font-size: 8.5pt !important;
        font-weight: 400 !important;
        overflow-wrap: anywhere !important;
      }

      .a4-html-root .cl-print-compact-targets {
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }

      .a4-html-root .cl-print-compact-targets li {
        display: inline !important;
      }

      .a4-html-root .cl-print-compact-targets li:not(:last-child)::after {
        content: '; ' !important;
      }

      .a4-html-root .cl-print-table {
        display: table !important;
        width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        border: 1px solid #64748b !important;
        font-size: 9pt !important;
        line-height: 1.3 !important;
      }

      .a4-html-root.a4-portrait .cl-col-batch { width: 24% !important; }
      .a4-html-root.a4-portrait .cl-col-samples { width: 38% !important; }
      .a4-html-root.a4-portrait .cl-col-targets { width: 38% !important; }
      .a4-html-root.a4-landscape .cl-col-batch { width: 22% !important; }
      .a4-html-root.a4-landscape .cl-col-samples { width: 40% !important; }
      .a4-html-root.a4-landscape .cl-col-targets { width: 38% !important; }

      .a4-html-root .cl-print-table thead {
        display: table-header-group !important;
      }

      .a4-html-root .cl-print-table th {
        padding: 2.2mm 2.5mm !important;
        border: 1px solid #64748b !important;
        background: #e2e8f0 !important;
        color: #0f172a !important;
        text-align: left !important;
        text-transform: uppercase !important;
        letter-spacing: 0.04em !important;
        font-size: 8pt !important;
        font-weight: 800 !important;
      }

      .a4-html-root .cl-print-table td {
        padding: 2.5mm !important;
        border: 1px solid #94a3b8 !important;
        vertical-align: top !important;
        overflow-wrap: anywhere !important;
      }

      .a4-html-root .cl-print-assignment-row {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .a4-html-root .cl-print-batch-start td {
        border-top-width: 1.5px !important;
        border-top-color: #334155 !important;
      }

      .a4-html-root .cl-print-batch-cell {
        display: flex !important;
        align-items: flex-start !important;
        gap: 2.5mm !important;
      }

      .a4-html-root .cl-print-batch-info {
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }

      .a4-html-root .cl-print-sop {
        font-weight: 700 !important;
        color: #334155 !important;
      }

      .a4-html-root .cl-print-meta,
      .a4-html-root .cl-print-count {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 1.5mm !important;
        margin-top: 1mm !important;
        color: #64748b !important;
        font-size: 7.5pt !important;
        font-weight: 600 !important;
      }

      .a4-html-root .cl-print-samples + .cl-print-meta {
        color: #86198f !important;
      }

      .a4-html-root .cl-print-samples {
        font-size: 9pt !important;
        font-weight: 400 !important;
      }

      .a4-html-root .cl-print-sample-code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-weight: 800 !important;
      }

      .a4-html-root .cl-print-sample-description,
      .a4-html-root .cl-print-sample-separator {
        font-family: Arial, Helvetica, sans-serif !important;
        font-weight: 400 !important;
      }

      .a4-html-root .cl-print-targets {
        margin: 0 !important;
        padding-left: 4mm !important;
      }

      .a4-html-root .cl-print-targets li {
        margin: 0 0 0.7mm !important;
      }

      .a4-html-root .cl-print-missing {
        font-style: italic !important;
        color: #92400e !important;
      }

      .a4-html-root .cl-print-scope {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.8mm !important;
        color: #172554 !important;
      }

      .a4-html-root .cl-print-scope strong {
        font-size: 8.5pt !important;
        line-height: 1.2 !important;
      }

      .a4-html-root .cl-print-scope span {
        color: #64748b !important;
        font-size: 7.5pt !important;
        font-weight: 700 !important;
      }

`;
