// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

// dependencies
global.__basedir = path.resolve(__dirname, '../');
const sqlite3Adapter = require('./main-process/services/storage/sql/sql');
const Storage = require('./main-process/services/storage/storage');

const NodesService = new (require('./main-process/nodes/nodes'))();
const TransactionsService = new (require('./main-process/transactions/transactions'))();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  })

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

  mainWindow.once("ready-to-show", () => {
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
app.on('ready', async () => {

  await Storage.init(sqlite3Adapter);

  const initPromises = [
    NodesService.init(),
    TransactionsService.init(),
  ];

  await Promise.all(initPromises);

  createWindow();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// function emitTransaction() {
//   console.log('Event - Transactions Updated');
//   mainWindow.send('transactions', transactions);
// }

// ipcMain.on('add-transaction', async (event, transaction) => {
//   console.log('Add Transaction', transaction);
//   // add to db
//   const {"last_insert_rowid()":id} = await TransactionsService.addTransaction({
//     date: transaction.date,
//     from: transaction.from,
//     to: transaction.to,
//     amount: transaction.amount,
//   });
//   console.info('Added Transaction to DB');

//   // add to UI
//   transactions.push({
//     postDate: transaction.date,
//     source: Number.parseInt(transaction.from),
//     target: Number.parseInt(transaction.to),
//     amount: Number.parseFloat(transaction.amount),
//     id,
//   });
//   console.info('Added Transaction to UI');

//   // announce
//   emitTransaction();
// });

// ipcMain.on('remove-transaction', async (event, removedId) => {
//   console.log('Remove Transaction', removedId);
//   // remove from db
//   await TransactionsService.removeTransaction({
//     id: removedId
//   });
//   console.info('Removed Transaction from DB');

//   // remove from UI
//   const index = transactions.findIndex((item) => item.id == removedId);
//   if (index !== -1) { 
//     transactions.splice(index, 1);
//     console.info('Removed Transaction from UI state');
//   }

//   // announce
//   emitTransaction();
// });