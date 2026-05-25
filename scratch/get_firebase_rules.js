const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

const serviceAccount = require('../lims-cloud-by-otada-firebase-adminsdk-fbsvc-5efa8d19f2.json');

function base64url(buf) {
  return buf.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function signJWT(payload, privateKey) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  
  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  
  const stringToSign = `${encodedHeader}.${encodedPayload}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(stringToSign);
  const signature = base64url(sign.sign(privateKey));
  
  return `${stringToSign}.${signature}`;
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.readonly https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3000,
      iat: now - 60 // 1 minute in the past to prevent clock drift issues
    };
    
    const jwt = signJWT(jwtPayload, serviceAccount.private_key);
    
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;
    
    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error('Failed to get access token: ' + JSON.stringify(parsed)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function makeApiRequest(accessToken, url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log("Generating access token...");
  const token = await getAccessToken();
  console.log("Token obtained successfully!");
  
  const projectId = serviceAccount.project_id;
  
  // First, get the active release for Firestore
  console.log("Fetching active firestore rules release...");
  const releasesUrl = `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`;
  const releasesData = await makeApiRequest(token, releasesUrl);
  
  // Find the release named 'projects/{project_id}/releases/cloud.firestore'
  const firestoreRelease = releasesData.releases && releasesData.releases.find(r => r.name.endsWith('/cloud.firestore'));
  
  if (!firestoreRelease) {
    console.log("No active cloud.firestore release found.");
    return;
  }
  
  console.log(`Active ruleset for cloud.firestore: ${firestoreRelease.rulesetName}`);
  
  // Now fetch the ruleset details to get the source code
  const rulesetUrl = `https://firebaserules.googleapis.com/v1/${firestoreRelease.rulesetName}`;
  const rulesetData = await makeApiRequest(token, rulesetUrl);
  
  if (rulesetData.source && rulesetData.source.files) {
    rulesetData.source.files.forEach(file => {
      console.log(`\n--- File: ${file.name} ---`);
      console.log(file.content);
    });
  } else {
    console.log("Failed to fetch ruleset source or no files present:");
    console.log(JSON.stringify(rulesetData, null, 2));
  }
}

run().catch(console.error);
