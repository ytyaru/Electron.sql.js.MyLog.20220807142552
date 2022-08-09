window.addEventListener('DOMContentLoaded', async(event) => {
    console.log('DOMContentLoaded!!');
    //console.log(window.myApi)
    //window.myApi.setup();
    //const db = await window.myApi.loadDb(`src/db/mylog.db`);
    //console.log(db)
    //console.log(db.exec) // main.jsでは関数なのにこちらではundefinedの謎
    //console.log(db.exec(`select * from comments;`)) // Uncaught (in promise) TypeError: db.exec is not a function
    await window.myApi.loadDb(`src/db/mylog.db`)
    console.log(await window.myApi.get())
//    const sqlFile = new Sqlite3DbFile()
//    const downloader = new MyLogDownloader(db)
//    const uploader = new MyLogUploader(db, sqlFile)

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
        document.getElementById('post-list').innerHTML = 
            db.insert(document.getElementById('content').value)
            + document.getElementById('post-list').innerHTML
        /*
        const content = document.getElementById('content').value
        if (!content) { alert('つぶやく内容をテキストエリアに入力してください。'); return; }
        if (LENGTH < content.length) { alert(`つぶやく内容は${LENGTH}字以内にしてください。`); return; }
        const match = content.match(/\r\n|\n/g)
        if (match && LINE < match.length) { alert(`つぶやく内容は${LINE}行以内にしてください。`); return; }
        const now = Math.floor(new Date().getTime() / 1000)
        const insHtml = db.insert({content:content, created:now})
        //const record = window.myApi.insert({content:content, created:now});
        */
        /*
        //const insHtml = await db.insert(content, now)
        document.getElementById('post-list').innerHTML = insHtml + document.getElementById('post-list').innerHTML
        document.getElementById('content').value = ''
        document.getElementById('content').focus()
        if (sqlFile.db) {
            const path = document.getElementById('file-input').value
            const name = path.replace(/.*[\/\\]/, '');
            sqlFile.db.exec(`insert into comments(content, created) values('${content}', ${now});`)
            const res = await sqlFile.write(name)
            if (res) { Toaster.toast(`ローカルファイルにも追記しました。: ${name}`) }
        }
        */
        /*
        const content = document.getElementById('content').value
        if (!content) { alert('つぶやく内容をテキストエリアに入力してください。'); return }
        const now = Math.floor(new Date().getTime() / 1000)
        const record = window.myApi.insert({content:content, created:now});
        */
        /*
        document.getElementById('post-list').innerHTML = db.insert(content, now) + document.getElementById('post-list').innerHTML
        document.getElementById('content').value = ''
        document.getElementById('content').focus()
        //if (document.getElementById('is-over-write').checked) {
            const path = document.getElementById('file-input').value
            const name = path.replace(/.*[\/\\]/, '');
            //sqlFile.read(name)
            //const res = sqlFile.db.exec(`select * from comments where created = (select MAX(created) from comments);`)
            sqlFile.db.exec(`insert into comments(content, created) values('${content}', ${now});`)
            await sqlFile.write(name)
            //console.debug(sqlFile.file)
            //sqlFile.write(sqlFile.file.name)
            Toaster.toast(`ローカルファイルを上書きしました。: ${name}`)
        //}
        */
    })
    document.querySelector('#delete').addEventListener('click', async()=>{
        /*
        if (confirm('つぶやきをすべて削除します。\n本当によろしいですか？')) {
            await db.clear()
            document.getElementById('post-list').innerHTML = await db.toHtml()
            document.getElementById('content').focus()
        }
        */
        const ids = Array.from(document.querySelectorAll(`#post-list input[type=checkbox][name=delete]:checked`)).map(d=>parseInt(d.value))
        console.debug(ids)
        //window.myApi.delete(ids);
        db.delete(ids)
        /*
        //await db.delete(deletes)
        document.getElementById('post-list').innerHTML = await db.toHtml()
        if (sqlFile.db) {
            const path = document.getElementById('file-input').value
            const name = path.replace(/.*[\/\\]/, '');
            sqlFile.db.exec(`BEGIN;`)
            for (const id of deletes) {
                sqlFile.db.exec(`delete from comments where id = ${id};`)
            }
            sqlFile.db.exec(`COMMIT;`)
            const res = await sqlFile.write(name)
            if (res) { Toaster.toast(`ローカルファイルからも削除しました。: ${name}`) }
        }
        */
    })
    document.querySelector('#download')?.addEventListener('click', async()=>{
        await downloader.download()
    })
});

