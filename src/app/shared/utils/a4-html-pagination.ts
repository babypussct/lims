import { clonePrintContent } from './print-dom';

/** Detached snapshot of a domain renderer for preview and both output paths. */
export interface A4HtmlSource {
  header: HTMLElement;
  table?: HTMLTableElement;
  cards?: HTMLElement[];
  cardColumns?: number;
  after?: HTMLElement[];
  css: string;
}

export function paginateHtmlA4(source: A4HtmlSource, orientation: 'portrait' | 'landscape', preparedAt: string): HTMLElement {
  const root = document.createElement('div');
  root.className = `a4-html-root a4-${orientation}`;
  const style = document.createElement('style');
  style.textContent = `
    .a4-html-root{color:#172033;font-family:'Open Sans',Arial,sans-serif;text-align:left}
    .a4-html-root .print-page{box-sizing:border-box;width:${orientation === 'landscape' ? 297 : 210}mm;height:${orientation === 'landscape' ? 210 : 297}mm;padding:10mm 10mm 14mm;position:relative;display:flex;flex-direction:column;background:white;margin-bottom:16px}
    .a4-html-root .a4-html-header{flex-shrink:0;margin-bottom:4mm}
    .a4-html-root .a4-html-body{flex:1;min-height:0}
    .a4-html-root .a4-html-columns{display:grid;grid-template-columns:repeat(${source.cardColumns || 2},minmax(0,1fr));gap:4mm;align-items:start}
    .a4-html-root .a4-html-column{min-width:0}
    .a4-html-root .a4-html-footer{position:absolute;left:10mm;right:10mm;bottom:6mm;border-top:1px solid #cbd5e1;padding-top:1mm;display:flex;justify-content:space-between;font-size:9px;color:#475569}
    @media print{.a4-html-root .print-page{margin:0;break-after:page}.a4-html-root .print-page:last-child{break-after:auto}}
    ${source.css}`;
  root.appendChild(style);
  const measurement = document.createElement('div');
  measurement.style.cssText = 'position:absolute;left:-100000px;top:0;';
  measurement.appendChild(root);
  document.body.appendChild(measurement);
  let body!: HTMLElement;
  const newPage = () => {
    const page = document.createElement('article');
    page.className = 'print-page';
    const header = clonePrintContent(source.header);
    header.classList.add('a4-html-header');
    body = document.createElement('div');
    body.className = 'a4-html-body';
    const footer = document.createElement('footer');
    footer.className = 'a4-html-footer';
    const stamp = document.createElement('span');
    stamp.textContent = `Chuẩn bị bản in: ${preparedAt}`;
    footer.append(stamp, document.createElement('span'));
    page.append(header, body, footer);
    root.appendChild(page);
  };
  const fits = () => body.scrollHeight <= body.clientHeight + 0.5;
  const tooLong = () => new Error('Một dòng hoặc nhóm nội dung quá dài cho A4. Vui lòng rút gọn nội dung hoặc chọn bố cục khác trước khi in.');
  try {
    newPage();
    if (source.table) {
      const tableTemplate = source.table;
      const fragment = () => {
        const table = clonePrintContent(tableTemplate);
        table.querySelector('tbody')!.replaceChildren();
        body.appendChild(table);
        return table;
      };
      let table = fragment();
      for (const row of Array.from(tableTemplate.querySelectorAll('tbody > tr'))) {
        const copy = row.cloneNode(true) as HTMLElement;
        table.querySelector('tbody')!.appendChild(copy);
        if (fits()) continue;
        copy.remove();
        if (!table.querySelector('tbody')!.children.length) throw tooLong();
        newPage();
        table = fragment();
        table.querySelector('tbody')!.appendChild(copy);
        if (!fits()) throw tooLong();
      }
    }
    if (source.cards) {
      let columns: HTMLElement[] = [];
      let columnIndex = 0;
      const startColumns = () => {
        const grid = document.createElement('div');
        grid.className = 'a4-html-columns';
        columns = Array.from({ length: source.cardColumns || 2 }, () => {
          const column = document.createElement('div');
          column.className = 'a4-html-column';
          grid.appendChild(column);
          return column;
        });
        columnIndex = 0;
        body.appendChild(grid);
      };
      const nextColumn = () => {
        columnIndex++;
        if (columnIndex === columns.length) { newPage(); startColumns(); }
      };
      startColumns();
      for (const card of source.cards) {
        const groups = Array.from(card.querySelectorAll<HTMLElement>('.cl-print-compact-group'));
        let current: HTMLElement | undefined;
        for (const group of groups) {
          const makeFragment = () => {
            const fragment = clonePrintContent(card);
            fragment.querySelectorAll('.cl-print-compact-group').forEach(node => node.remove());
            columns[columnIndex].appendChild(fragment);
            return fragment;
          };
          current ||= makeFragment();
          const copy = clonePrintContent(group);
          current.appendChild(copy);
          if (fits()) continue;
          copy.remove();
          if (!current.querySelector('.cl-print-compact-group')) current.remove();
          nextColumn();
          current = makeFragment();
          current.appendChild(copy);
          if (!fits()) throw tooLong();
        }
      }
    }
    for (const block of source.after || []) {
      const copy = clonePrintContent(block);
      body.appendChild(copy);
      if (fits()) continue;
      copy.remove();
      if (!body.children.length) throw tooLong();
      newPage();
      body.appendChild(copy);
      if (!fits()) throw tooLong();
    }
    const pages = Array.from(root.querySelectorAll('.print-page'));
    pages.forEach((page, index) => { page.querySelector('.a4-html-footer')!.lastElementChild!.textContent = `Trang ${index + 1}/${pages.length}`; });
    return root;
  } finally { measurement.remove(); }
}
