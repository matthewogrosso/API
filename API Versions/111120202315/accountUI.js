var http = require('http');

var accountForm = `
    <h1>Charge or Pay</h1>
    <form id="accountChargeForm" accept-charset=utf-8>
        <label>Account</label><br>
        <input id="account" placeholder="Account Number" /><br>

        <label>Provider</label><br>
        <input id="provider" placeholder="Provider" /><br>

        <label>Amount</label><br>
        <input id="amount" placeholder="Charge or Pay Amount" /><br>

        <button id="submitCharge">Submit Charge</button>
        <button id="submitPayment">Submit Payment</button>
    </form>
    <div id="submissionResults"></div>
    <style>
        * { box-sizing: border-box; }
        #accountChargeForm { border: 1px solid; padding: 15px; width: 255px; }
        input { margin-bottom: 10px; }
    </style>
    <script>
        function submitCharge (accountId, provider, chargeAmount) {
            httpRequest = new XMLHttpRequest()
            httpRequest.onreadystatechange = sendCharge
            var url = document.URL.replace('8081', '8080')
            httpRequest.open('GET', url + '?Account=' + accountId + '&Provider=' + provider + '&Action=charge&Amount=' + chargeAmount)
            httpRequest.send()
        }

        function submitPayment (accountId, provider, paymentAmount) {
            httpRequest = new XMLHttpRequest()
            httpRequest.onreadystatechange = sendPayment
            var url = document.URL.replace('8081', '8080')
            httpRequest.open('GET', url + '?Account=' + accountId + '&Provider=' + provider + '&Action=pay&Amount=' + paymentAmount)
            httpRequest.send()
        }

        function sendPayment () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var response = JSON.parse(httpRequest.responseText)

                    if (response.success === false) {
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = 'Pay attempt failed.'
                    } else {
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = 'Payment was successful<br>Old Balance of ' + response.Provider + ': ' + response.OldBalance + '<br>New Balance of ' + response.Provider + ': ' + response.NewBalance + '<br>Date/Time: ' + response.dateTime + '<br>Receipt #: ' + response.unixTime
                    }
                } else {
                    console.log('There was a problem with the request.')
                }
            }
        }

        function sendCharge () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    var response = JSON.parse(httpRequest.responseText)

                    if (response.success === false) {
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = 'Charge attempt failed.'
                    } else {
                        submissionResults = document.getElementById('submissionResults')
                        submissionResults.innerHTML = 'Charge was successful<br>Old Balance of ' + response.Provider + ': ' + response.OldBalance + '<br>New Balance of ' + response.Provider + ': ' + response.NewBalance + '<br>Date/Time: ' + response.dateTime + '<br>Receipt #: ' + response.unixTime
                    }
                } else {
                    console.log('There was a problem with the request.')
                }
            }
        }

        var submitChargeButton = document.getElementById('submitCharge')

        submitChargeButton.onclick = function (e) {
            e.preventDefault()
            var accountId = document.getElementById('account').value
            var provider = document.getElementById('provider').value
            var chargeAmount = document.getElementById('amount').value
            submitCharge(accountId, provider, chargeAmount)
        }

        var submitPaymentButton = document.getElementById('submitPayment')
        
        submitPaymentButton.onclick = function (e) {
            e.preventDefault()
            var accountId = document.getElementById('account').value
            var provider = document.getElementById('provider').value
            var paymentAmount = document.getElementById('amount').value
            submitPayment(accountId, provider, paymentAmount)
        }
    </script>
`

http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(accountForm)
    res.end()
}).listen(8081);

console.log('Form running on port 8081')