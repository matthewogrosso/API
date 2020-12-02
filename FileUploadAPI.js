var http = require('http')
var formidable = require('formidable')
var fs = require('fs')

http.createServer(function(request, response) {
    if (request.url == '/fileupload') {
        var form = new formidable.IncomingForm()

        form.parse(request, function (err, fields, files) {
            var oldpath = files.filetoupload.path
            var newpath = './uploads/' + files.filetoupload.name

            fs.rename(oldpath, newpath, function(err) {
                if (err) throw err
                response.write('File uploaded and moved.')
                response.end()
            })
        })
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write('<form action="fileupload" method="post" enctype="multipart/form-data">')
        response.write('<input type="file" name="filetoupload"><br>')
        response.write('<input type="submit">')
        response.write('</form>')
        return response.end()
    }
}).listen(8097)

console.log('File Upload API running on port 8097')