var fs = require('fs');

var logName = 'access.log'
var faviconLogName = 'favicon.log'
var headerLogName = 'header.log'

function writeAccessLog(logEntry) {
    fs.appendFile(logName, logEntry, function (err) {
        //if (err) throw err;
        console.log('Log Entry: ' + logName)
        console.log(logEntry)
    }); 
}

function writeFaviconLog(faviconRequestHeader) {
    fs.appendFile(faviconLogName, JSON.stringify(faviconRequestHeader), function () {
        console.log('Favicon Log Entry: ' + faviconLogName)
        console.log(faviconRequestHeader)
    })
}

function writeHeaderLog(headerString) {
    fs.appendFile(headerLogName, headerString, function () {
        console.log('Header Log Entry: ' + headerLogName)
        console.log(headerString)
    })
}

function writeChatClientLog (clientChatString) {
    fs.appendFile('chatclient.log', clientChatString, function () {
        console.log('Header Log Entry: ' + 'chatclient.log')
        console.log(clientChatString)
    })
}

exports.writeAccessLog = writeAccessLog
exports.writeFaviconLog = writeFaviconLog
exports.writeHeaderLog = writeHeaderLog
exports.writeChatClientLog = writeChatClientLog
