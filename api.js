var http = require('http');
var fs = require('fs');
const {Ledger} = require('./ledger')
const {Account} = require('./account')
const {writeAccessLog, writeFaviconLog, writeHeaderLog} = require('./WriteAccessLog')

try {
    const NewAccountStore = JSON.parse(fs.readFileSync('./NewAccount.json', 'utf8'))
    var NewAccount = new Account(NewAccountStore.id, NewAccountStore.creditLines, NewAccountStore.creditLineIds, NewAccountStore.extraCredit)

    const NewLedgerStore = JSON.parse(fs.readFileSync('./NewLedger.json', 'utf8'))
    var NewLedger = new Ledger(NewLedgerStore)
} catch (error) {
    var NewAccount = new Account(9387)
        NewAccount.addCreditLine('IS', 10)
        NewAccount.chargeBalance('IS', 1)
        NewAccount.payBalance('IS', 1)

    fs.writeFile('NewAccount.json', JSON.stringify(NewAccount), function(err) {
        if (err) throw err;
        console.log('Saved NewAccount');
    })

    var NewLedger = new Ledger()
        NewLedger.addEntry('System', 'System', 0, new Date(), 'None')

    fs.writeFile('NewLedger.json', JSON.stringify(NewLedger.entries), function(err) {
        if (err) throw err;
        console.log('Saved NewLedger');
    })
}

function saveLedgerToFile (time) {
    if (time) {
        fs.writeFile('receipts/NewLedger.' + time + '.json', JSON.stringify(NewLedger.entries), function(err) {
            if (err) throw err;
            console.log('Wrote NewLedger.' + time + '.json');
        })
    } else {
        fs.writeFile('NewLedger.json', JSON.stringify(NewLedger.entries), function(err) {
            if (err) throw err;
            console.log('Wrote NewLedger.json');
        })
    }
}

function saveAccountToFile (time) {
    if (time) {
        fs.writeFile('receipts/NewAccount.' + time + '.json', JSON.stringify(NewAccount), function(err) {
            if (err) throw err;
            console.log('Wrote NewAccount.' + time + '.json');
        })
    } else {
        fs.writeFile('NewAccount.json', JSON.stringify(NewAccount), function(err) {
            if (err) throw err;
            console.log('Wrote NewAccount.json');
        })
    }
    
}

http.createServer(function(req,res) {
    var accessDate = new Date()
    var remoteAddress = req.connection.remoteAddress
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

    urlDataObject.success = false

    try {
        if(urlDataObject.Action == 'charge' && urlDataObject.Account == NewAccount.id) {
            console.log('\nCharging ' + urlDataObject.Provider)
            urlDataObject.OldBalance = NewAccount.getBalance(urlDataObject.Provider)
            NewAccount.chargeBalance(urlDataObject.Provider, urlDataObject.Amount)
            urlDataObject.NewBalance = NewAccount.getBalance(urlDataObject.Provider)

            if (urlDataObject.OldBalance == urlDataObject.NewBalance) {
                urlDataObject.success = false
            } else {
                urlDataObject.success = true
            }
            
            saveAccountToFile()
            var currentDateTime = new Date()
            urlDataObject.dateTime = currentDateTime
            urlDataObject.unixTime = currentDateTime.getTime()
            NewLedger.addEntry(NewAccount.id, 'system', parseInt(urlDataObject.Amount), currentDateTime, urlDataObject.Provider)
            saveLedgerToFile()
            saveLedgerToFile(currentDateTime.getTime())
            saveAccountToFile(currentDateTime.getTime())
        }
    
        if(urlDataObject.Action == 'pay' && urlDataObject.Account == NewAccount.id) {
            console.log('\nPaying ' + urlDataObject.Provider)
            urlDataObject.OldBalance = NewAccount.getBalance(urlDataObject.Provider)
            NewAccount.payBalance(urlDataObject.Provider, urlDataObject.Amount)
            urlDataObject.NewBalance = NewAccount.getBalance(urlDataObject.Provider)
            urlDataObject.success = true
            saveAccountToFile()
            var currentDateTime = new Date()
            urlDataObject.dateTime = currentDateTime
            urlDataObject.unixTime = currentDateTime.getTime()
            NewLedger.addEntry(urlDataObject.Provider, 'system', parseInt(urlDataObject.Amount), currentDateTime, urlDataObject.Provider)
            saveLedgerToFile()
            saveLedgerToFile(currentDateTime.getTime())
            saveAccountToFile(currentDateTime.getTime())
        }
    
        if(urlDataObject.Action == 'getBalance' && urlDataObject.Account == NewAccount.id) {
            console.log('\nGetting balance of ' + urlDataObject.Provider)
            urlDataObject.Balance = NewAccount.getBalance(urlDataObject.Provider)
            console.log('Balance of ' + urlDataObject.Provider + ' is ' + urlDataObject.Balance)
            urlDataObject.success = true
        }
    
        if(urlDataObject.Action == 'getLimit' && urlDataObject.Account == NewAccount.id) {
            console.log('\nGetting limit of ' + urlDataObject.Provider)
            urlDataObject.Limit = NewAccount.getLimit(urlDataObject.Provider)
            console.log('Limit of ' + urlDataObject.Provider + ' is ' + urlDataObject.Limit)
            urlDataObject.success = true
        }

        if(urlDataObject.Action == 'getProviders' && urlDataObject.Account == NewAccount.id) {
            urlDataObject.Providers = NewAccount.getProviders()
            urlDataObject.success = true
        }

        if (urlDataObject.Action == 'checkRoutine') {
            urlDataObject.success = true
        }
    } catch (err) {
        console.log('\nSomething went wrong loading the page.')
    }

    res.write(JSON.stringify(urlDataObject))
    res.end()
}).listen(8087);

console.log('API running on port 8087')
