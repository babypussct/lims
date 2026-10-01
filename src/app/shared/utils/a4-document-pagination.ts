import { clonePrintContent } from './print-dom';

/** Repeat document identity and table headings; never split or discard a row. */
export function paginateA4Document(source: HTMLElement): HTMLElement {
  const document = source.ownerDocument;
  const root = source.cloneNode(false) as HTMLElement;
  root.classList.remove('a4-document-source');
  root.removeAttribute('aria-hidden');
  const template = source.querySelector<HTMLElement>('.a4-document-page');
  if (!template) throw new Error('Không tìm thấy mẫu trang A4.');
  const measurement = document.createElement('div');
  measurement.style.cssText = 'position:absolute;left:-100000px;top:0;width:210mm;';
  measurement.appendChild(root);
  document.body.appendChild(measurement);
  const sections = Array.from(template.querySelectorAll<HTMLElement>('.a4-document-body > section'));
  let body = template.querySelector<HTMLElement>('.a4-document-body')!;
  const newPage = () => {
    const page = clonePrintContent(template);
    body = page.querySelector<HTMLElement>('.a4-document-body')!;
    body.replaceChildren();
    root.appendChild(page);
  };
  const fits = () => body.scrollHeight <= body.clientHeight + 0.5;
  try {
    newPage();
    for (const section of sections) {
      const rows = Array.from(section.querySelectorAll('tbody > tr'));
      if (!rows.length) continue;
      const fragment = () => {
        const clone = clonePrintContent(section);
        clone.querySelector('tbody')!.replaceChildren();
        body.appendChild(clone);
        return clone;
      };
      let current = fragment();
      for (const row of rows) {
        const copy = row.cloneNode(true) as HTMLTableRowElement;
        current.querySelector('tbody')!.appendChild(copy);
        if (fits()) continue;
        copy.remove();
        if (!current.querySelector('tbody')!.children.length) current.remove();
        // Retry the same row on a fresh page with the section's table headings.
        if (!body.children.length) throw new Error('Một dòng quá dài cho A4. Vui lòng rút gọn nội dung trước khi in.');
        newPage();
        current = fragment();
        current.querySelector('tbody')!.appendChild(copy);
        if (!fits()) throw new Error('Một dòng hoặc tiêu đề quá dài cho A4. Vui lòng rút gọn nội dung trước khi in.');
      }
    }
    Array.from(root.children).forEach((page, index, pages) => {
      page.querySelector('[data-page-number]')!.textContent = `Trang ${index + 1}/${pages.length}`;
    });
    return root;
  } finally {
    measurement.remove();
  }
}
