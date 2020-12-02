var http = require('http')
var fs = require('fs')
const {writeAccessLog, writeFaviconLog, writeHeaderLog} = require('./WriteAccessLog')

const CREDITUI = fs.readFileSync('./CREDITUI.HTML', 'utf8')

http.createServer(function(req,res) {
    var accessDate = new Date()
    var remoteAddress = req.connection.remoteAddress
    req.headers['RemoteAddress'] = remoteAddress
    req.headers['Date'] = accessDate

    if (req.url === '/favicon.ico') {
        writeFaviconLog(req.headers)
        res.writeHead(200, { 
            'Content-Type': 'image/x-icon',
            'Access-Control-Allow-Origin': '*' 
        })
        res.end()
        console.log('favicon requested')
        return
    }

    writeAccessLog(remoteAddress + ',' + req.url + ',' + accessDate + ',' + accessDate.getTime() + '\n')
    writeHeaderLog(JSON.stringify(req.headers))

    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
    });
    var urlData = req.url.replace('\/\?', '');
    var urlDataParts = urlData.split('\&');
    var urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    if (urlDataObject.Action == 'checkRoutine') {
        urlDataObject.success = true
        res.write(JSON.stringify(urlDataObject))
        res.end()
    } else {
        res.write(CREDITUI)
        res.end()
    }
}).listen(8082);

console.log('Credit View running on port 8082')
