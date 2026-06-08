
const fs = require('fs');
let content = fs.readFileSync('C:/Users/GCMS/Documents/GitHub/lims/src/app/features/results/result-pdf-helper.ts', 'utf8');

const sops = ['LanHuuCo', 'ChlorHuuCo', 'NhomCuc'];

sops.forEach(sop => {
    const fnStartStr = 'export function build' + sop + 'PdfPayload';
    const fnStartIdx = content.indexOf(fnStartStr);
    if (fnStartIdx === -1) return;

    const targetStr = \    } else {
      filteredSamples.forEach((sampleCode: string) => {
        const resObj = currentDraft.resultData[sampleCode] || {};
        const rowData: Record<string, any> = {
          maSoMau: sampleCode,\;

    const replacementStr = \    } else {
      let formDonSamples = [...filteredSamples];
      if (isDon) {
        formDonSamples.unshift('QC_BLANK', 'QC_SPIKE');
        if (currentDraft.page1Data['hasFinal']) formDonSamples.push('QC_FINAL');
      }

      formDonSamples.forEach((sampleCode: string) => {
        const resObj = currentDraft.resultData[sampleCode] || {};
        
        let displayMaSoMau = sampleCode;
        if (sampleCode === 'QC_BLANK') displayMaSoMau = currentDraft.page1Data['blankName'] || 'Blank';
        else if (sampleCode === 'QC_SPIKE') displayMaSoMau = currentDraft.page1Data['spikeName'] || 'Spike';
        else if (sampleCode === 'QC_FINAL') displayMaSoMau = 'FINAL';

        const rowData: Record<string, any> = {
          maSoMau: displayMaSoMau,\;

    const targetIdx = content.indexOf(targetStr, fnStartIdx);
    if (targetIdx !== -1) {
        content = content.substring(0, targetIdx) + replacementStr + content.substring(targetIdx + targetStr.length);
        console.log('Replaced for', sop);
    } else {
        console.log('Target string not found for', sop);
    }
});

fs.writeFileSync('C:/Users/GCMS/Documents/GitHub/lims/src/app/features/results/result-pdf-helper.ts', content, 'utf8');
console.log('done');

