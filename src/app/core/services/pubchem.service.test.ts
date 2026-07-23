import assert from 'node:assert/strict';
import test from 'node:test';
import { PubchemService } from './pubchem.service';

test('uses the PubChem record title instead of synonym ordering', async () => {
  const originalFetch = globalThis.fetch;
  const requestedUrls: string[] = [];

  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    requestedUrls.push(url);
    if (url.includes('/property/Title,IUPACName/')) {
      return new Response(JSON.stringify({
        PropertyTable: { Properties: [{ Title: 'Aspirin', IUPACName: '2-acetyloxybenzoic acid' }] },
      }), { status: 200 });
    }
    return new Response(JSON.stringify({
      InformationList: {
        Information: [{ Synonym: ['ACETYLSALICYLIC ACID', 'aspirin', '50-78-2'] }],
      },
    }), { status: 200 });
  }) as typeof fetch;

  try {
    const info = await new PubchemService().getChemicalInfo('50-78-2');
    assert.equal(info?.commercialName, 'Aspirin');
    assert.deepEqual(info?.synonyms, ['2-Acetyloxybenzoic acid', 'Acetylsalicylic acid']);
    assert.equal(requestedUrls.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
