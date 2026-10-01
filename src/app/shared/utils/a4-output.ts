import { clonePrintContent, printWithCleanup, waitForPrintAssets } from './print-dom';

/** Both native printing and PDF export consume the already prepared pages. */
export async function printPreparedA4(content: HTMLElement, signal?: AbortSignal, orientation: 'portrait' | 'landscape' = 'portrait'): Promise<void> {
  const container = document.getElementById('print-container');
  if (!container) throw new Error('Không tìm thấy vùng in.');
  const previous = Array.from(container.childNodes);
  const hadClass = document.body.classList.contains('lims-slip-printing');
  const pageStyle = document.createElement('style');
  pageStyle.textContent = `@media print { @page { size:A4 ${orientation}; margin:0; } body.lims-slip-printing #print-container{width:${orientation === 'landscape' ? 297 : 210}mm !important;} }`;
  const cleanup = () => {
    container.replaceChildren(...previous);
    if (!hadClass) document.body.classList.remove('lims-slip-printing');
    pageStyle.remove();
  };
  try {
    const clone = clonePrintContent(content);
    container.replaceChildren(clone);
    document.body.classList.add('lims-slip-printing');
    document.head.appendChild(pageStyle);
    await waitForPrintAssets(clone);
    if (!signal?.aborted) await printWithCleanup(window, () => {}, signal);
  } finally {
    cleanup();
  }
}

export async function downloadPreparedA4(content: HTMLElement, fileName: string, orientation: 'portrait' | 'landscape' = 'portrait'): Promise<void> {
  const staging = document.createElement('div');
  staging.style.cssText = 'position:absolute;left:-100000px;top:0;width:210mm;background:white;';
  try {
    const clone = clonePrintContent(content);
    staging.appendChild(clone);
    document.body.appendChild(staging);
    await waitForPrintAssets(clone);
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')]);
    const pages = Array.from(clone.querySelectorAll<HTMLElement>('.print-page'));
    if (!pages.length) throw new Error('Chưa có trang để xuất PDF.');
    const landscape = orientation === 'landscape';
    const pdf = new jsPDF({ orientation: landscape ? 'l' : 'p', unit: 'mm', format: 'a4', compress: true });
    for (let index = 0; index < pages.length; index++) {
      const page = pages[index];
      const ancestors = new Set<Element>();
      for (let node: Element | null = page; node; node = node.parentElement) ancestors.add(node);
      const canvas = await html2canvas(page, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
        // Avoid cloning the live form and all other pages for every capture.
        ignoreElements: element => (element.parentElement === document.body && !ancestors.has(element))
          || (element.classList.contains('print-page') && element !== page),
      });
      if (index) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, landscape ? 297 : 210, landscape ? 210 : 297);
    }
    pdf.save(fileName);
  } finally {
    staging.remove();
  }
}
