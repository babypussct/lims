const crypto = require('crypto');
const serviceAccount = require('../lims-cloud-by-otada-firebase-adminsdk-fbsvc-5efa8d19f2.json');

const header = { alg: 'RS256', typ: 'JWT' };
const payload = {
  iss: serviceAccount.client_email,
  scope: 'https://www.googleapis.com/auth/cloud-platform',
  aud: 'https://oauth2.googleapis.com/token',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000)
};

const base64url = buf => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
const stringToSign = `${encodedHeader}.${encodedPayload}`;

const sign = crypto.createSign('RSA-SHA256');
sign.update(stringToSign);
const signature = base64url(sign.sign(serviceAccount.private_key));

const verify = crypto.createVerify('RSA-SHA256');
verify.update(stringToSign);
const isValid = verify.verify(serviceAccount.private_key, Buffer.from(signature, 'base64'));

console.log("Local verification valid:", isValid);
