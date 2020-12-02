var http = require('http');
var fs = require('fs');
const {writeAccessLog, writeFaviconLog, writeHeaderLog} = require('./WriteAccessLog')
const { exec } = require('child_process')

var path = '/home/ogrosso/bin:/home/ogrosso/sbin'
exec('export PATH=' + path, () => {})

http.createServer(function(req,res) {
    var accessDate = new Date()
    var remoteAddress = req.connection.remoteAddress
    const ipAddress = remoteAddress.replace('::ffff:', '')
    const localIpAddress = remoteAddress.replace('::1', 'Local')

    var ipv4address1 = remoteAddress.replace(/\:/g, '')
    var ipv4address = ipv4address1.replace(/f/g, '')
    var iAddress = ipv4address.replace(/\./g, '')


    var sessionPath = 'session/session' + iAddress

    req.headers['RemoteAddress'] = remoteAddress
    req.headers['Date'] = accessDate

    if (req.url === '/favicon.ico') {
        writeFaviconLog(req.headers)
        res.writeHead(200, { 'Content-Type': 'image/x-icon' })
        res.end()
        console.log('favicon requested')
        return
    }

    writeAccessLog(remoteAddress + ',' + req.url + ',' + accessDate + ',' + accessDate.getTime() + '\n')
    writeHeaderLog(JSON.stringify(req.headers))

    var urlData = req.url.replace('\/\?', '');
    var urlDataParts = urlData.split('\&');
    var urlDataObject = {}
    
    for (var i = 0; i < urlDataParts.length; i++) {
        var keyValuePairs = urlDataParts[i].split('\=')
        urlDataObject[keyValuePairs[0]] = keyValuePairs[1]
    }

    // console.log("command: \"" + urlDataObject['Command'] + '"')
    // console.log("argumentString: \"" + urlDataObject['String'] + '"')

    urlDataObject.success = false

    const command = urlDataObject['Command']
    const argumentsString = urlDataObject['String'].replace(/\%20/g, ' ')
    const argumentsString2 = argumentsString.replace(/\%22/g, '"')
    const argumentsString3 = argumentsString2.replace(/\%27/g, "'")

    console.log(req.headers['user-agent'])

    try {
        var session = JSON.parse(fs.readFileSync(sessionPath, 'utf8'))

        var pushSuccess = session.access.push(new Date())
        var pushSuccess = session.command.push(command)
        var pushSuccess = session.arguments.push(argumentsString3)
        var pushSuccess = session.userAgent.push(req.headers['user-agent'])

        if (pushSuccess) {
            fs.writeFile(sessionPath, JSON.stringify(session), function(err) {
                if (err) throw err;
                console.log('Wrote ' + sessionPath);
            })
        }
    } catch (error) {
        var session = {
            sessionPath: sessionPath,
            ipAddress: ipv4address,
            access: [new Date()],
            command: [command],
            arguments: [argumentsString3],
            userAgent: [req.headers['user-agent']]
        }

        fs.writeFile(sessionPath, JSON.stringify(session), function (err) {
            if (err) throw err;
            console.log('Session Entry')
            console.log(session)
        }); 
    }

    if (!urlDataObject['Command'] && !urlDataObject['String']){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end()
        return
    }

    var fullCommand = ''

    if (command == argumentsString3) {
        fullCommand = command
    } else {
        fullCommand = command + ' ' + argumentsString3
    }

    console.log('fullCommand:', fullCommand)

    function writeEnd (writeOut) {
        res.write(writeOut)
        res.end()
        return true
    }

    res.writeHead(200, {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*'
    });

    try {
        exec(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
            }
        
            console.log(`stdout: ${stdout}`)

            urlDataObject.error = error
            urlDataObject.stdout = stdout
            urlDataObject.stderr = stderr

            urlDataObject.success = true

            var writeSuccess = writeEnd(JSON.stringify(urlDataObject))
        })
    } catch (error) {
        console.log('error:', error)
        res.write(JSON.stringify(urlDataObject))
        res.end()
    }
}).listen(8089);

console.log('Terminal API running on port 8089')
