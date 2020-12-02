var http = require('http')
var fs = require('fs')
var {nodes} = require('./NODES')
var nextNode = 0

function writeLastNodeChecked (lastNodeChecked) {
    fs.writeFile('LastNodeChecked.json', JSON.stringify(lastNodeChecked), function(err) {
        if (err) throw err;
        console.log('Saved ' + JSON.stringify(lastNodeChecked) + ' to LastNodeChecked.json');
    })
}

function writeNextNodeArrayLocation (location) {
    fs.writeFile('NextNodeArrayLocation', location, function(err) {
        if (err) throw err;
        console.log('Saved ' + location + ' to NextNodeArrayLocation');
    })
}

function checkRoutine () {
    // Check routine checks on self and system reported status of known nodes
    // Check includes http and file system interfaces
    //   http checks check if the service is running on the network
    //   file system checks check the status of the file responsible for the node on the local port

    console.log('\nSystem Check: Performing a routine check of node at port ' + nodes[nextNode].port)

    writeLastNodeChecked(nodes[nextNode])

    try {
        var options = {
            host: 'localhost',
            path: '/?Action=checkRoutine',
            port: nodes[nextNode].port,
            headers: {'Action-Intent': 'Check-Routine'}
        };

        var currentNode = nextNode

        if (nextNode === nodes.length - 1) {
            nextNode = 0
        } else {
            nextNode = nextNode + 1
        }

        writeNextNodeArrayLocation(nextNode)
        
        callback = function(response) {
            var str = ''
            
            response.on('data', function (chunk) {
                str += chunk;
            });
            
            response.on('end', function () {
                console.log('Port ' + nodes[nextNode].port + ': ' + str);
            });
        }

        var req = http.request(options, callback);
        req.end();
    } catch (err) {
        console.log('Could not complete http request.')
    }
}


setInterval(checkRoutine,5000)

http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
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
        res.end()
    }
}).listen(8083);

console.log('System Checks node running on port 8083')