var http = require('http')
var fs = require('fs')
const { writeAccessLog, writeFaviconLog, writeChatClientLog} = require('./WriteAccessLog')
const { User } = require('./User')

var usersServer = http.createServer((request, response) => {
    var accessDate = new Date()
    var remoteAddress = request.connection.remoteAddress
    request.headers['RemoteAddress'] = remoteAddress
    request.headers['Date'] = accessDate
    

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

    var urlData = request.url.replace('\/\?', '');
    var urlDataParts = urlData.split('\&');
    var urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    //var authentication = Authenticate(urlDataObject)
    var userVerification = User(urlDataObject)

    console.log(userVerification)

    //writeChatClientLog(accessDate+','+remoteAddress+',AUTHENTICATION,Authenticated:'+authentication.authenticated)

    response.write(JSON.stringify(userVerification))

    response.end()
})

usersServer.listen(8094)

console.log('Authentication Server listening on port 8094')