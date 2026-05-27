const admin = require('firebase-admin');
const serviceAccount = require('../lims-cloud-by-otada-firebase-adminsdk-fbsvc-5efa8d19f2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {
  try {
    const colRef = db.collection('artifacts/lims-cloud-fixed/master_analytes');
    const snapshot = await colRef.orderBy('name').get();
    
    console.log('--- MASTER ANALYTES IN FIRESTORE ---');
    console.log(`Total: ${snapshot.size} analytes found.`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID/Slug: "${doc.id}" | Name: "${data.name}"`);
    });
    
  } catch (error) {
    console.error('Error fetching master analytes:', error);
  } finally {
    process.exit(0);
  }
}

run();
