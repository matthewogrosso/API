var fs = require('fs')
var http = require('http')
var { SanitizeUrl } = require('./../Utilities/SanitizeUrl')

function getUserStatus(user) {
    var logFile = './user/' + user + '-status.json'
    var UserStatus = JSON.parse(fs.readFileSync(logFile, 'utf8'))
}

function logoutUser (user) {
    var userFileName = './user/' + user + '-status.json'

    fs.stat(userFileName, function (err, stats) {
        console.log(stats)
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink(userFileName,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     });
     
}

var activeUsersList = {}

function updateActiveUsersObject (userObject) {
    if (activeUsersList[userObject.userName]) {
        activeUsersList[userObject.userName][userObject.userValueName] = userObject.userValue
    } else {
        activeUsersList[userObject.userName] = {}
        activeUsersList[userObject.userName][userObject.userValueName] = userObject.userValue
    }
}

function getAllActiveUsers () {
    const userFolder = './user/'
    const fs = require('fs')

    console.log('running getAllActiveUsers()...')

    fs.readdirSync(userFolder).forEach(file => {
        var userName = file.replace('-status.json', '')
        console.log(file)
        updateActiveUsersObject({userName: userName, userValueName: 'active', userValue: 'true'})
        updateActiveUsersObject({userName: userName, userValueName: 'filename', userValue: file })
    })

    console.log(activeUsersList)

    return activeUsersList
}

function setUserStatus(user, stat) {
    var logFile = './user/' + user + '-status.json'

        try {
            var UserStatus = JSON.parse(fs.readFileSync(logFile, 'utf8'))
            var sanitizedInput = SanitizeUrl(stat.stat)
            
                UserStatus.stats[stat.name] = sanitizedInput

            var logEntry = JSON.stringify(UserStatus)

            fs.writeFile(logFile, logEntry, function(err) {
                if (err) throw err;
                console.log(user + 'status written to ' + logFile)
            })
            return true
        } catch (err) {
            var UserStatus = {
                stats: {}
            }
            var sanitizedInput = SanitizeUrl(stat.stat)

            UserStatus.stats[stat.name] = sanitizedInput

            var logEntry = JSON.stringify(UserStatus)

            fs.writeFile(logFile, logEntry, function(err) {
                if (err) throw err;
                console.log(user + 'status written to ' + logFile)
            })
            return true
        }
}

var ActiveUserAPIServer = http.createServer(function(Request, Response) {
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

    try {
        if (urlDataObject.Action == 'UpdateStatus') {
            var setUserStatusSuccess = setUserStatus(urlDataObject.User, {
                name: urlDataObject.StatName,
                stat: urlDataObject.Stat
            })

            if (setUserStatusSuccess) {
                urlDataObject.success = true
                urlDataObject.ResponseMessage = urlDataObject.User 
                + ' status of ' + urlDataObject.StatName 
                + ' set to ' + urlDataObject.Stat + '.'
            }
        }

        console.log(urlDataObject)

        if (urlDataObject.Action == 'GetAllActiveUsers') {
            urlDataObject.AllActiveUsers = getAllActiveUsers()
            urlDataObject.success = true
        }

        if (urlDataObject.Action == 'Logout') {
            logoutUser(urlDataObject.User)
            urlDataObject.success = true
            urlDataObject.ActionPerformed = 'Logout ' + urlDataObject.User
        }
    } catch (err) {
        console.log('No Action requested.')
    }

    Response.write(JSON.stringify(urlDataObject))
    Response.end()
}).listen(8080)

console.log('Active User API Server running on port 8080.')