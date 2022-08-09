window.addEventListener('DOMContentLoaded', async(event) => {
    console.debug('DOMContentLoaded!!');
    await window.myApi.loadDb(`src/db/mylog.db`)
    const db = new MyLogDb()
//    const downloader = new MyLogDownloader(db)
//    const uploader = new MyLogUploader(db, sqlFile)
    const LENGTH = 140
    const LINE = 15
    Loading.setup()
    //uploader.setup()
    document.getElementById('post-list').innerHTML = await db.toHtml()
    document.getElementById('content').focus()
    document.getElementById('content-length').textContent = LENGTH;

    document.querySelector('#post').addEventListener('click', async()=>{
        const insHtml = await db.insert(document.getElementById('content').value)
        console.debug(insHtml)
        document.getElementById('post-list').innerHTML = insHtml + document.getElementById('post-list').innerHTML
    })
    document.querySelector('#delete').addEventListener('click', async()=>{
        const ids = Array.from(document.querySelectorAll(`#post-list input[type=checkbox][name=delete]:checked`)).map(d=>parseInt(d.value))
        console.debug(ids)
        await db.delete(ids)
        document.getElementById('post-list').innerHTML = await db.toHtml()
    })
    document.querySelector('#download')?.addEventListener('click', async()=>{
        await downloader.download()
    })
});

