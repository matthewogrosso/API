var http = require('http')
var fs = require('fs')
const { writeAccessLog, writeFaviconLog, writeChatClientLog} = require('./WriteAccessLog')
const { Authenticate } = require('./Authenticate')

function buildUrlDataObject (requestUrl) {
    var urlData = requestUrl.replace('\/\?', ''),
        urlDataParts = urlData.split('\&'),
        urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    return urlDataObject
}

var authServer = http.createServer((request, response) => {
    var accessDate = new Date(),
        remoteAddress = request.connection.remoteAddress

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

    var urlDataObject = buildUrlDataObject(request.url),
        authentication = Authenticate(urlDataObject)

    writeChatClientLog('\n'+accessDate+','+remoteAddress+',AUTHENTICATION,Authenticated:'+authentication.authenticated)

    response.write(JSON.stringify(authentication))
    response.end()
})

authServer.listen(8092)

console.log('Authentication Server listening on port 8092')