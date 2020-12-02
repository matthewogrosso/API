var http = require('http');
var fs = require('fs');
const {writeAccessLog} = require('./WriteAccessLog')
const { exec, spawn } = require('child_process')

http.createServer(function(req,res) {
    var remoteAddress = req.connection.remoteAddress
    writeAccessLog(remoteAddress + '\t,\t' + '12351TERMINALAPI' + '\t,\t' + new Date() + '\n')

    var urlData = req.url.replace('\/\?', '');
    var urlDataParts = urlData.split('\&');
    var urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    urlDataObject.success = false

    const command = urlDataObject['Command']
    const argumentsString = urlDataObject['String']

    function writeEnd (writeOut) {
        res.write(writeOut)
        return 'success'
    }

    res.writeHead(200, {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*'
    });

    const terminalCommand = spawn(command, argumentsString.split(' '))

    terminalCommand.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        urlDataObject.stdout = data
        urlDataObject.success = true
    })

    terminalCommand.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`)
        urlDataObject.stdout = data
        urlDataObject.success = true
    })

    terminalCommand.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        urlDataObject.code = code
        urlDataObject.success = true
    })

    function checkWriteSuccess () {
        if (urlDataObject.success == true) {
            res.write(JSON.stringify(urlDataObject))
            res.end()
        } else {
            setTimeout(function() {
                checkWriteSuccess()
            },100)
        }
    }

    checkWriteSuccess()
}).listen(46890);

console.log('Terminal Spawn API running on port 46890')