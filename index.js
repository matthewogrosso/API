var http = require('http');
var fs = require('fs');
const {writeAccessLog} = require('./WriteAccessLog')

const head = fs.readFileSync('./head.html', 'utf8')
const style = fs.readFileSync('./style.css', 'utf8')
const script = fs.readFileSync('./script.js', 'utf8')
const body = fs.readFileSync('./body.html', 'utf8')

const index = `
<!DOCTYPE html>
<html>
    <head>
        ${head}
        <style>
            ${style}
        </style>
    </head>
    <body>
        ${body}
        <script>
            ${script}
        </script>
    </body>
</html>
`
http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});

    var headers = req.headers
    console.log('\n---\n')
    console.log(headers)
    var host = headers.host ? headers.host : 'ghost'
    console.log(host)

    var remoteAddress = req.connection.remoteAddress
    console.log(remoteAddress)
    var xForwardedFor = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : 'no_proxy'
    console.log(xForwardedFor)

    writeAccessLog(remoteAddress + '\t,\t' + '8085Index' + '\t,\t' + new Date() + '\n')

    var authorization = headers.authorization ? headers.authorization : false
    console.log(authorization)

    if (authorization) {
        var authorizationBase64Value = authorization.replace('Basic ', '')
        console.log(authorizationBase64Value)
        var base64AuthorizationBuffer = new Buffer(authorizationBase64Value, 'base64')
        console.log(base64AuthorizationBuffer)
        var authorizationString = base64AuthorizationBuffer.toString('ascii')
        console.log(authorizationString)
    }
    
    var referer = headers.referer ? headers.referer : 'empty_string'
    console.log(referer)
    var UserAgent = headers['user-agent'] ? headers['user-agent'] : 'no_ghosts'
    console.log('User Agent:', UserAgent)
    var AcceptEncoding = headers['accept-encoding'] ? headers['accept-encoding'] : 'no_encode'
    console.log(AcceptEncoding)
    var AcceptLanguage = headers['accept-language'] ? headers['accept-language'] : '-;,=.'
    console.log(AcceptLanguage)
    var Accept = headers['accept'] ? headers['accept'] : 'no_accept'
    console.log(Accept)

    var acceptLanguageSemicolonParts = AcceptLanguage.split(';')
    console.log(acceptLanguageSemicolonParts)
    var acceptLanguageCommaParts = AcceptLanguage.split(',')
    console.log(acceptLanguageCommaParts)
    var acceptLanguageEqualParts = AcceptLanguage.split('=')
    console.log(acceptLanguageEqualParts)
    var acceptLanguageDashParts = AcceptLanguage.split('-')
    console.log(acceptLanguageDashParts)
    var acceptLanguageDotParts = AcceptLanguage.split('.')
    console.log(acceptLanguageDotParts)

    var acceptLanguageenParts = AcceptLanguage.split('en')
    console.log(acceptLanguageenParts)
    var acceptLanguageUSParts = AcceptLanguage.split('US')
    console.log(acceptLanguageUSParts)



    var urlTrail = req.protocol + '://' + req.url.split('/')

    //console.log(urlTrail)

    //console.log(req.hostname)
    //console.log(req.body)

    var urlData = urlTrail[urlTrail.length - 1].replace('\?', '');
    //console.log(urlData)
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
        res.write(index)
        res.end()
    }
}).listen(8085);

console.log('Web Server running on port 8085')