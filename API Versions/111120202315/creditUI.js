var http = require('http');

var creditView = `
<head>
    <title>Credit View</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Credit View</h1>
    <h2>Providers</h2>
    <div id="resultsView"></div>
    <h2>Returned JSON</h2>
    <div id="submissionResults"></div>
    <style>
        * { box-sizing: border-box; }
        .provider { border: 1px solid; margin: 10px 0; }
        .provider { font-size: 1.2em; padding: 15px; line-height: 1.5em; margin: 10px; min-width: 144px; }
        div#submissionResults { font-family: monospace; line-height: 1.25em; margin: 25px; padding: 25px; border: 3px solid; }
        #pulse { position: absolute; top: 0; right: 0; width: 25px; height: 25px; border-radius: 50%; background-color: red; opacity: 50%; animation-name: pulseAnimation; animation-duration: 1.25s; }
        @keyframes pulseAnimation { 0% { transform: scale(1,1) } 20% { transform: scale(0.75,0.75) } 50% { transform: scale(1.25,1.25) } 80% { transform: scale(0.75,0.75) } 100% { transform: scale(1,1) } }
        .one-third { display: inline-block; width: calc(100% / 3); }
    </style>
    <script>
        function loadProviders (accountId) {
            httpRequest = new XMLHttpRequest()
            httpRequest.onreadystatechange = receiveProviders
            var url = document.URL.replace('8082', '8080')
            httpRequest.open('GET', url + '?Account=9387&Action=getProviders')
            httpRequest.send()
        }

        function getProvidersHTML (creditLines) {
            var creditLinesHTML = ''
        
            for (var i = 0; i < creditLines.length; i++) {
                creditLinesHTML = creditLinesHTML + 
                '<div class="provider" id="provider' + creditLines[i].provider + '">' +
                    '<div class="one-third full-mobile">' +
                        '<b>Provider</b>: <em>' + creditLines[i].provider + '</em>' +
                    '</div>' +
                    '<div class="one-third full-mobile">' +
                        '<b>Balance</b>: <em>' + creditLines[i].balance + '</em>' +
                    '</div>' +
                    '<div class="one-third full-mobile">' +
                        '<b>Limit</b>: <em>' + creditLines[i].limit + '</em>' +
                    '</div>' +
                '</div>'
            }

            var pulseHTML = '<div id="pulse"></div>'
        
            var providersHTML = '<div id="providers">' + creditLinesHTML + '</div>'
        
            return providersHTML + pulseHTML
        }

        function receiveProviders () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var response = JSON.parse(httpRequest.responseText)

                    if (response.success === false) {
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = 'Failed to get Providers.'
                    } else {
                        resultsView = document.getElementById('resultsView')
                        resultsView.innerHTML = getProvidersHTML(response.Providers.creditLines)
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = JSON.stringify(response.Providers)
                    }
                } else {
                    console.log('There was a problem with the request.')
                }
            }
        }

        loadProviders(9387)

        window.setInterval(function () {
            loadProviders(9387)
        }, 60000)
    </script>
</body>
`

http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(creditView)
    res.end()
}).listen(8082);

console.log('Credit View running on port 8082')