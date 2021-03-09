// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');

// dependencies
global.__basedir = path.resolve(__dirname, '../');
const sqlite3Adapter = require('./main-process/services/storage/sql/sql');
const Storage = require('./main-process/services/storage/storage');

const AdminService = new (require('./main-process/admin/admin'))();
const NodesService = new (require('./main-process/nodes/nodes'))();
const TransactionsService = new (require('./main-process/transactions/transactions'))();
const BulkImportService = new (require('./main-process/bulkImport/bulkImport'))();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js',
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  const startUrl = (process.env.NODE_ENV === 'local') ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.once('show', () => {
    // mainWindow.webContents.send('transactions', transactions);
    // mainWindow.webContents.send('nodes', nodes);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  (async () => {
    await Storage.init(sqlite3Adapter);
  
    const initPromises = [
      AdminService.init(),
      NodesService.init(),
      TransactionsService.init(),
      BulkImportService.init(),
    ];
  
    await Promise.all(initPromises);
  
    createWindow();
  })();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('before-quit', () => {
  Storage.close();
  console.log('Database connection closed.');
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})
