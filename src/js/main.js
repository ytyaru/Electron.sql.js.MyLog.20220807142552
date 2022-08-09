const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const initSqlJs = require('sql.js');
//const util = require('util')
//const childProcess = require('child_process');
const lib = new Map()

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //transparent: true, // 透過
        //opacity: 0.3,
        //frame: false,      // フレームを非表示にする
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile('index.html')
    //mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

async function loadDb(filePath=`src/db/mylog.db`) {
    if (null === filePath) { filePath = `src/db/mylog.db` }
    if (!lib.has(`DB`)) {
        const SQL = await initSqlJs().catch(e=>console.error(e))
        lib.set(`SQL`, SQL)
        const db = new SQL.Database(new Uint8Array(fs.readFileSync(filePath)))
        lib.set(`DB`, db)
        console.log(db)
        console.log(db.exec)
        const res = db.exec(`select * from comments;`)
        console.log(res)
    }
    //console.log(lib)
    return lib.get(`DB`)
}

// ここではdb.execを参照できるが、return後では参照できない謎
ipcMain.handle('loadDb', async(event, filePath=null) => {
    console.log('----- loadDb ----- ', filePath)
    return loadDb(filePath)
})
// db.execの実行結果を返すならOK
ipcMain.handle('get', async(event) => {
    console.log('----- get ----- ')
    if (!lib.has(`SQL`)) {
        //await ipcRenderer.invoke('loadDb', filePath),
        loadDb()
    }
    //console.log(lib)
    //console.log(lib.get(`DB`))
    const res = lib.get(`DB`).exec(`select * from comments order by created desc;`)
    //console.log(res)
    return res[0].values
})
ipcMain.handle('insert', async(event, r)=>{
    if (!lib.has(`SQL`)) {loadDb()}
    const record = lib.get(`DB`).exec(`insert into comments(content, created) values('${r.content}', r.created);`)
    console.log(record)
    return record
})
ipcMain.handle('clear', async(event)=>{
    lib.get(`DB`).exec(`delete from comments;`)
})
ipcMain.handle('delete', async(event, ids)=>{
    lib.get(`DB`).exec(`begin;`)
    for (const id of ids) {
        lib.get(`DB`).exec(`delete from comments where id = ${id};`)
    }
    lib.get(`DB`).exec(`commit;`)
})
/*
ipcMain.handle('delete', async(event, ids=null)=>{
    console.debug(ids)
    const isAll = (0===ids.length)
    const msg = ((isAll) ? `つぶやきをすべて削除します。` : `選択したつぶやきを削除します。`) + `\n本当によろしいですか？`
    if (confirm(msg)) {
        console.debug('削除します。')
        if (isAll) { console.debug('全件削除します。'); lib.get(`DB`).exec(`delete from comments;`) }
        else {
            console.debug('選択削除します。')
            lib.get(`DB`).exec(`begin;`)
            for (const id of ids) {
                lib.get(`DB`).exec(`delete from comments where id = ${id};`)
            }
            lib.get(`DB`).exec(`commit;`)
        }
        console.debug(await this.dexie.comments.toArray())
    }
})
*/
ipcMain.handle('exportDb', async(event)=>{
    return lib.get(`DB`).export()
})



/*
ipcMain.handle('open', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [{ name: 'Documents', extensions: ['txt'] }],
    })
    if (canceled) return { canceled, data: [] }
    const data = filePaths.map((filePath) =>
        fs.readFileSync(filePath, { encoding: 'utf8' })
    )
    return { canceled, data }
})
ipcMain.handle('save', async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [{ name: 'Documents', extensions: ['txt'] }],
    })
    if (canceled) { return }
    fs.writeFileSync(filePath, data)
})
ipcMain.handle('shell', async (event, command) => {
    const exec = util.promisify(childProcess.exec);
    return await exec(command);
    //let result = await exec(command);
    //document.getElementById('result').value = result.stdout;
})
*/
