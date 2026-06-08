const {app, BrowserWindow, dialog} = require('electron');
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');
const {homedir} = require("node:os");

const isDev = !app.isPackaged;
const resourcesPath = isDev ? __dirname : process.resourcesPath;

const jarDir = path.join(resourcesPath, 'backend')
const portFile = path.join(homedir(), '.fileorganizer', 'port.txt')

console.log('App startet...')
console.log('jarDir:', jarDir)
console.log('portFile:', portFile)

async function waitForPort(timeoutMs = 60000) {
    return new Promise((resolve, reject) => {
        const start = Date.now()
        const interval = setInterval(() => {
            console.log('Waiting on port.txt...')
            if (fs.existsSync(portFile)) {
                const port = fs.readFileSync(portFile, 'utf8').trim()
                console.log('Port found:', port)
                clearInterval(interval)
                resolve(port)
            }
            if (Date.now() - start > timeoutMs) {
                clearInterval(interval)
                reject(new Error('Timeout: Java started not in time.'))
            }
        }, 500)
    })
}

function getJavaExecutable() {
    const isWin = process.platform === 'win32';
    const binaryName = isWin ? 'java.exe' : 'java';

    const platformFolder = isWin ? 'windows' : 'mac';

    const bundledJava = path.join(jarDir, 'jre', platformFolder, 'bin', binaryName);

    console.log("Searching JRE in: " + bundledJava);

    if (fs.existsSync(bundledJava)) {
        console.info("JRE found in App-Bundle: " + bundledJava);
        return bundledJava;
    } else {
        console.error("ERROR: No JRE found in: " + bundledJava);
        return null;
    }
}

app.whenReady().then(async () => {
    console.log('Electron ready')

    if (fs.existsSync(portFile)) {
        fs.unlinkSync(portFile)
    }

    const javaExecutable = getJavaExecutable();
    if (!javaExecutable) {
        dialog.showErrorBox("Java not found", "File Organizer requires Java 26+.");
        app.quit();
        return;
    }

    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, {recursive: true});
    }

    const logStream = fs.createWriteStream(path.join(userDataPath, 'java_error.log'));

    const javaProcess = spawn(javaExecutable, ['-jar', path.join(jarDir, 'File_organazier-1.0.jar')]);

    javaProcess.stdout.pipe(logStream);
    javaProcess.stderr.pipe(logStream);

    javaProcess.stdout.on('data', (data) => console.log('Java Out:', data.toString()));
    javaProcess.stderr.on('data', (data) => console.error('Java Err:', data.toString()));

    javaProcess.on('error', (err) => {
        console.error('JAR start error:', err);
        dialog.showErrorBox("Starting Error", "Java couldn't start: " + err.message);
    });

    app.on('before-quit', () => javaProcess.kill());

    const port = await waitForPort();

    console.log('Windows open. Port open on:', port);

    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 780,
        minHeight: 600,
        center: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            additionalArguments: [`--backend-port=${port}`],
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.once('ready-to-show', () => {
        win.show();
        win.focus();
    });

    setTimeout(() => {
        if (!win.isVisible()) {
            win.show();
        }
    }, 5000);

    await win.loadFile(path.join(__dirname, "frontend-dist", 'index.html'));
})

app.on('window-all-closed', () => app.quit())