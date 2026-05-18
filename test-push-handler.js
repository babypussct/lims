const tsNode = require('ts-node');
tsNode.register({
    compilerOptions: {
        module: "CommonJS",
        target: "ES2022",
        esModuleInterop: true
    }
});

const handler = require('./api/push.ts').default;

const req = {
    method: 'POST',
    body: {
        recipientUids: ['test'],
        title: 'test',
        body: 'test',
        appId: 'lims-cloud-fixed'
    }
};

const res = {
    setHeader: () => {},
    status: (code) => {
        console.log("Status:", code);
        return res;
    },
    json: (data) => {
        console.log("JSON:", data);
        return res;
    },
    end: () => console.log("End")
};

(async () => {
    try {
        await handler(req, res);
    } catch (e) {
        console.error("Uncaught Error:", e);
    }
})();
