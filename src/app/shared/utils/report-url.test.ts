import assert from 'node:assert/strict';
import test from 'node:test';
import { getSafeGooglePreviewUrl, getSafeGoogleUrl, sanitizeReportMapUrls } from './report-url';

const FILE_ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';
const DOC_ID = '1ZaYxWvUtSrQpOnMlKjIhGfEdCbA987654';

test('canonicalizes supported Drive and Docs report URLs', () => {
  assert.equal(
    getSafeGoogleUrl(`https://drive.usercontent.google.com/download?id=${FILE_ID}&export=download`, 'pdf'),
    `https://drive.google.com/file/d/${FILE_ID}/view`
  );
  assert.equal(
    getSafeGoogleUrl(`https://drive.google.com/file/d/${FILE_ID}/view?usp=drivesdk`, 'pdf'),
    `https://drive.google.com/file/d/${FILE_ID}/view`
  );
  assert.equal(
    getSafeGoogleUrl(`https://docs.google.com/document/d/${DOC_ID}/edit?tab=t.0`, 'doc'),
    `https://docs.google.com/document/d/${DOC_ID}/preview`
  );
  assert.equal(
    getSafeGooglePreviewUrl(`https://drive.google.com/file/d/${FILE_ID}/view`),
    `https://drive.google.com/file/d/${FILE_ID}/preview`
  );
});

test('rejects non-https, unapproved hosts and mismatched Google product URLs', () => {
  for (const url of [
    'javascript:alert(1)',
    'http://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view',
    'https://evil.example/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view',
    'https://google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view'
  ]) {
    assert.equal(getSafeGoogleUrl(url, 'pdf'), '');
    assert.equal(getSafeGooglePreviewUrl(url), '');
  }
  assert.equal(getSafeGoogleUrl(`https://docs.google.com/document/d/${DOC_ID}/edit`, 'pdf'), '');
  assert.equal(getSafeGoogleUrl(`https://drive.google.com/file/d/${FILE_ID}/view`, 'doc'), '');
});

test('sanitizes URLs inside report maps before persistence', () => {
  const result = sanitizeReportMapUrls({
    a: {
      pdfUrl: `https://drive.google.com/file/d/${FILE_ID}/view`,
      docsUrl: 'https://evil.example/report',
      version: 1
    }
  });
  assert.equal(result?.a.pdfUrl, `https://drive.google.com/file/d/${FILE_ID}/view`);
  assert.equal(result?.a.docsUrl, '');
});
