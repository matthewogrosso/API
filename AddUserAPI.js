var http = require('http')
var fs = require('fs')
const { writeAccessLog, writeFaviconLog, writeChatClientLog} = require('./WriteAccessLog')
const { AddUser } = require('./AddUser')

var authServer = http.createServer((request, response) => {
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

    if (urlDataObject.Action === 'AddUser') {
        var addUserResponse = AddUser(urlDataObject)

        writeChatClientLog(accessDate+','+remoteAddress+',ADDUSER,AddUserSuccess:'+addUserResponse.AddUserSuccess)

        response.write(JSON.stringify(addUserResponse))
    } else {
        response.write(JSON.stringify({Message: "Action=AddUser must be present in request to add a user"}))
    }

    response.end()
})

authServer.listen(8095)

console.log('Authentication Server listening on port 8095')