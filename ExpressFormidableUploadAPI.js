const express = require('express');
const formidable = require('formidable');
var fs = require('fs')
 
const app = express();
 
app.get('/', (req, res) => {
  res.send(`
    <h2>With <code>"express"</code> npm package</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});
 
app.post('/api/upload', (req, res, next) => {
  const form = formidable({ multiples: true });
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    var oldpath = files.someExpressFiles.path
    var newpath = './uploads/' + files.someExpressFiles.name

    files.someExpressFiles.newPath = newpath
    
    fs.rename(oldpath, newpath, function(err) {
        if (err) throw err
        console.log('file uploaded and moved.')
    })

    res.json({ fields, files });
  });
});
 
app.listen(8098, () => {
  console.log('Server listening on http://localhost:8098 ...');
});