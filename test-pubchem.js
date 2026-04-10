async function test() {
  const query = '50-00-0'; // Formaldehyde CAS
  const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${query}/JSON`);
  if (!response.ok) {
     console.log('Failed fetching from pug_view with CAS. Trying standard API...');
     const searchRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${query}/cids/JSON`);
     const searchData = await searchRes.json();
     if(searchData.IdentifierList && searchData.IdentifierList.CID) {
        const cid = searchData.IdentifierList.CID[0];
        const response2 = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`);
        const data = await response2.json();
        console.log('Fetched via CID. Searching...');
        extract(data);
     }
  } else {
     const data = await response.json();
     extract(data);
  }
}

let foundGHS = new Set();
const extract = (obj) => {
    if (typeof obj === 'string') {
        const matchIcon = obj.match(/GHS0[1-9]/g);
        if (matchIcon) matchIcon.forEach(m => foundGHS.add(m));
        
        const matchHP = obj.match(/^(?:H|P)[0-9]{3}.+?(?=\[|$)/g);
        if (matchHP) {
            matchHP.forEach(m => foundGHS.add(m.trim().replace(/\s*\([^)]*\)\s*:/, ':')));
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(o => extract(o));
    } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(v => extract(v));
    }
}

test().then(() => console.log('Found GHS:', Array.from(foundGHS)));
