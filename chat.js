var http = require('http')
var fs = require('fs')
const {writeAccessLog, writeFaviconLog, writeHeaderLog, writeChatClientLog} = require('./WriteAccessLog')
const CHAT = fs.readFileSync('./CHAT.HTML', 'utf8')

var chatClientServer = http.createServer((request, response) => {
    console.log(request.headers)
    var accessDate = new Date()
    var remoteAddress = request.connection.remoteAddress
    request.headers['RemoteAddress'] = remoteAddress
    request.headers['Date'] = accessDate
    writeChatClientLog(accessDate+','+remoteAddress)

    if (request.url === '/favicon.ico') {
        writeFaviconLog(request.headers)
        response.writeHead(200, { 
            'Content-Type': 'image/x-icon',
            'Access-Control-Allow-Origin': '*' 
        })
        response.end()
        return
    }

    response.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });

    response.end(CHAT)
})

chatClientServer.listen(8093)

console.log('Chat Server listening on port 8093')