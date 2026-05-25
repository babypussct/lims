const admin = require('firebase-admin');
const serviceAccount = require('../lims-cloud-by-otada-firebase-adminsdk-fbsvc-5efa8d19f2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function inspect() {
  console.log("Fetching users from Firestore...");
  const snapshot = await db.collection('artifacts/lims-cloud-fixed/users').get();
  console.log(`Found ${snapshot.size} users:`);
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

inspect().catch(console.error);
