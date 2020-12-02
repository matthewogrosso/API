var fs = require('fs')
var http = require('http')
const {writeAccessLog, writeFaviconLog, writeHeaderLog} = require('./WriteAccessLog')
var { SanitizeUrl } = require('./../Utilities/SanitizeUrl')


function LogMessage (room, user, message) {
    var dateTime = new Date()
    var logFile = './room/' + room + '.log'
    
    var logMessage = '\n' + dateTime.toLocaleString() + '::' + user + "::" + SanitizeUrl(message)

    try {
        fs.appendFile(logFile, logMessage, function () {
            // console.log('message written to ' + logFile)
        })
        return true
    } catch (err) {
        return false
    }
}

LogMessage('General', 'admin', 'Admin test message.')

var ChatLogServer = http.createServer(function(Request, Response) {
    var accessDate = new Date()
    var remoteAddress = Request.connection.remoteAddress
    Request.headers['RemoteAddress'] = remoteAddress
    Request.headers['Date'] = accessDate

    if (Request.url === '/favicon.ico') {
        writeFaviconLog(Request.headers)
        Response.writeHead(200, { 'Content-Type': 'image/x-icon' })
        Response.end()
        console.log('favicon requested')
        return
    }

    Response.writeHead(200, {
        'Content-Type': 'text/html', 
        'Access-Control-Allow-Origin': '*'
    })

    var urlData = Request.url.replace('\/\?', '');
    var urlDataParts = urlData.split('\&');
    var urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    urlDataObject.success = false

    if (urlDataObject.Action == 'GetChatLog') {
        const ChatLog = fs.readFileSync('./room/' + urlDataObject.room + '.log', 'utf8')
        urlDataObject.ChatLog = {room: urlDataObject.room, log: ChatLog}
        urlDataObject.success = true
        Response.write(JSON.stringify(urlDataObject))
        Response.end()
        return
    }

    try {
        if (urlDataObject.Message && urlDataObject.Room && urlDataObject.User && urlDataObject.Action == 'LogMessage') {
            var spaceReplaceMessage = urlDataObject.Message.replace(/\%20/g, ' ')
                urlDataObject.Message = spaceReplaceMessage
            var logMessageSuccess = LogMessage(urlDataObject.Room, urlDataObject.User, urlDataObject.Message)
            
            writeAccessLog(remoteAddress + ',' + Request.url + ',' + accessDate + ',' + accessDate.getTime() + '\n')
            writeHeaderLog(JSON.stringify(Request.headers))

            if (logMessageSuccess) {
                urlDataObject.success = true
            }
        }
    } catch (err) {
        console.log('Call did not meet all requirements to log chat message.')
    }

    Response.write(JSON.stringify(urlDataObject))
    Response.end()
}).listen(8096)

console.log('Chat Log API running on port 8096')