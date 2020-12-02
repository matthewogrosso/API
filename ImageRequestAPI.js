var path = require('path');
var http = require('http');
var fs = require('fs');

var dir = path.join(__dirname, '')

var mime = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png'
}

var server = http.createServer(function (Request, Response) {
    var RequestPath = Request.url.toString().split('?')[0];
    console.log('reqpath:',RequestPath)
    if (Request.method !== 'GET') {
        Response.statusCode = 501;
        Response.setHeader('Content-Type', 'text/plain');
        return Response.end('Method not implemented');
    }
    var file = path.join(dir, RequestPath.replace(/\/$/, '/index.html'));
    console.log('file:',file)
    if (file.indexOf(dir + path.sep) !== 0) {
        Response.statusCode = 403;
        Response.setHeader('Content-Type', 'text/plain');
        return Response.end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    console.log('type:',type)
    var s = fs.createReadStream(file)
    s.on('open', function () {
        Response.setHeader('Content-Type', type);
        s.pipe(Response);
    });
    s.on('error', function () {
        Response.setHeader('Content-Type', 'text/plain');
        Response.statusCode = 404;
        Response.end('Not found');
    });
});

server.listen(8090, function () {
    console.log('Listening on port 8090');
});