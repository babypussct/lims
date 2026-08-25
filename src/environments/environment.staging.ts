export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDQcd_LZkieJVMbe8ALm6aH7wj7FeDfcWI',
    authDomain: 'lims-activity-stg-260825.firebaseapp.com',
    projectId: 'lims-activity-stg-260825',
    messagingSenderId: '913307249579',
    appId: '1:913307249579:web:61b2e022412b3e73a400ee',
    vapidKey: ''
  },
  // Staging must not reuse the production Drive/GAS integrations.
  googleDrive: {
    apiKey: '',
    clientId: '',
    folderId: '',
    appId: ''
  },
  gasReportUrl: ''
};
