const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const handlers = require('../service/api');

const knex = require('knex')({
  client: 'sqlite',
  useNullAsDefault: true,
  connection: {
    filename: path.join(app.getPath('userData'), 'local.sqlite3'),
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './service/migration',
    tableName: 'migrations',
  },
});

global.knex = knex;

async function createWindow() {
  await knex.migrate.latest();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../service/preload.js'),
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  for (const handler in handlers) {
    ipcMain.on(handler, handlers[handler]);
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
