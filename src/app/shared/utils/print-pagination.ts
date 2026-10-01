import { clonePrintContent } from './print-dom';

/** Measure at paper width, pair short slips and split long tables on row boundaries. */
export function paginatePrintSlips(source: HTMLElement, showCutLine: boolean): HTMLElement {
  const document = source.ownerDocument;
  const root = source.cloneNode(false) as HTMLElement;
  root.removeAttribute('id');
  const measurement = document.createElement('div');
  measurement.style.cssText = 'position:absolute;left:-100000px;top:0;width:210mm;';
  const measureRoot = source.cloneNode(false) as HTMLElement;
  measurement.appendChild(measureRoot);
  document.body.appendChild(measurement);
  const ruler = document.createElement('div');
  ruler.style.height = '297mm';
  measureRoot.appendChild(ruler);
  const pageHeight = ruler.getBoundingClientRect().height;
  ruler.remove();
  if (!pageHeight) { measurement.remove(); throw new Error('Không đo được khổ giấy in.'); }

  let halfPage: HTMLElement | null = null;
  const page = () => {
    const node = document.createElement('div');
    node.className = 'print-page';
    // Preserve Angular's scoped style attributes on elements created here.
    for (const attribute of Array.from(source.attributes)) {
      if (attribute.name.startsWith('_ngcontent-')) node.setAttribute(attribute.name, '');
    }
    root.appendChild(node);
    return node;
  };
  const height = (slip: HTMLElement) => {
    measureRoot.replaceChildren(slip);
    return slip.getBoundingClientRect().height;
  };
  try {
    for (const original of Array.from(source.children) as HTMLElement[]) {
      const full = clonePrintContent(original);
      if (height(full) <= pageHeight / 2 - 1) {
        full.style.height = '148.5mm';
        if (!halfPage) {
          halfPage = page();
          halfPage.appendChild(full);
        } else {
          if (showCutLine) halfPage.classList.add('print-cut-line');
          halfPage.appendChild(full);
          halfPage = null;
        }
        continue;
      }
      halfPage = null;
      if (height(full) <= pageHeight - 1) {
        full.style.height = '297mm';
        page().appendChild(full);
        continue;
      }
      const rows = Array.from(full.querySelectorAll<HTMLTableRowElement>('.main-table tbody > tr'));
      let offset = 0;
      let part = 1;
      while (offset < rows.length) {
        const fragment = clonePrintContent(original);
        const tbody = fragment.querySelector('tbody')!;
        tbody.replaceChildren();
        const label = document.createElement('div');
        label.textContent = `Phiếu nhiều trang · Phần ${part++}`;
        label.style.cssText = 'font-size:9px;font-weight:700;margin-bottom:6px;';
        fragment.prepend(label);
        const start = offset;
        while (offset < rows.length) {
          const row = rows[offset].cloneNode(true) as HTMLTableRowElement;
          tbody.appendChild(row);
          if (height(fragment) > pageHeight - 1) { row.remove(); break; }
          offset++;
        }
        if (offset === start) throw new Error('Thông tin đầu phiếu hoặc một dòng quá dài cho A4. Vui lòng rút gọn ghi chú hoặc tách phiếu trước khi in.');
        fragment.style.height = '297mm';
        page().appendChild(fragment);
      }
      if (!rows.length) throw new Error('Thông tin phiếu quá dài cho A4. Vui lòng tách phiếu trước khi in.');
    }
    const pages = Array.from(root.children);
    pages.forEach((node, index) => {
      const number = document.createElement('div');
      number.style.cssText = 'position:absolute;right:15mm;bottom:5mm;font:8px Arial;color:#64748b;';
      number.textContent = `Trang ${index + 1}/${pages.length}`;
      node.appendChild(number);
    });
    return root;
  } finally {
    measurement.remove();
  }
}
