const {remote,contextBridge,ipcRenderer} =  require('electron');
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

contextBridge.exposeInMainWorld('myApi', {
    setup: ()=>{
        document.querySelector('#post').addEventListener('click', async()=>{

        })
        document.querySelector('#delete').addEventListener('click', async()=>{

        })
        document.querySelector('#download').addEventListener('click', async()=>{

        })
        /*
        document.querySelector('#open').addEventListener('click', async () => {
            console.debug(`openをclickした！`)
            const { canceled, data } = await ipcRenderer.invoke('open')
            if (canceled) { return }
            document.querySelector('#text').value = data[0] || ''
        })
        document.querySelector('#save').addEventListener('click', async () => {
            const data =  document.querySelector('#text').value
            await ipcRenderer.invoke('save', data)
        })
        document.querySelector('#run').addEventListener('click', async () => {
            const result = await ipcRenderer.invoke('shell', document.getElementById('command').value)
            document.getElementById('result').value = result.stdout;
        })
        */
        console.log('setup()')
    },
    loadDb:async(filePath)=>await ipcRenderer.invoke('loadDb', filePath),
    get:async()=>await ipcRenderer.invoke('get'),
    insert:async(record)=>await ipcRenderer.invoke('insert', record),
    clear:async()=>await ipcRenderer.invoke('delete'),
    delete:async(ids)=>await ipcRenderer.invoke('delete', ids),
    exportDb:async()=>await ipcRenderer.invoke('exportDb'),
    //loadDb:(filebuffer)=>initSqlJs().then((SQL)=>new SQL.Database(filebuffer)).catch(e=>console.error(e)),
    //loadSql:
    //loadDb:(filebuffer)=>initSqlJs().then((SQL)=>new SQL.Database(filebuffer)).catch(e=>console.error(e)),
    /*
    loadDb:async(fileAsUnit8array)=>{
        const SQL = await initSqlJs()
        return new this.SQL.Database(fileAsUnit8array)
        //this.DB = new this.SQL.Database(new Uint8Array(buf))
    },
    */
    /*
    loadDb:async(path)=>{
        console.log(path)
        console.log(initSqlJs)
        const SQL = await initSqlJs().catch(e=>console.error(e))
        console.log(SQL)
        const db = fs.readFileSync(path)
        console.log(db)
        console.log(new Uint8Array(db))
        console.log(new SQL.Database(new Uint8Array(db)))
        return new SQL.Database(new Uint8Array(db)) // Uncaught (in promise) TypeError: sqlDb.exec is not a function
        //return new this.SQL.Database(db) // Uncaught (in promise) Error: Cannot read properties of undefined (reading 'Database')
        //this.DB = new this.SQL.Database(new Uint8Array(buf))
    },
    */
    /*
    open:async()=>await ipcRenderer.invoke('open'),
    save:async()=>await ipcRenderer.invoke('save'),
    readFile:(path, kwargs=null)=>{
        //if (!kwargs) { kwargs = { encoding: 'utf8' } }
        return fs.readFileSync(path, kwargs)
    },
    writeFile:(path, data)=>fs.writeFileSync(path, data),
    runShell:async()=>await ipcRenderer.invoke('shell'),
    */
})

