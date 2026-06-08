const {contextBridge} = require('electron');


const portArg = process.argv.find(arg => arg.startsWith('--backend-port='));
const port = portArg ? portArg.split('=')[1] : '9999';

contextBridge.exposeInMainWorld('electronAPI', {
    backendPort: port
});