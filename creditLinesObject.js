const result = {
    "creditLines":[{
        "provider":"IS",
        "balance":0,
        "limit":500000
    },
    {
        "provider":"UX",
        "balance":0,
        "limit":3800000
    },
    {
        "provider":"OS",
        "balance":5091,
        "limit":700000
    },
    {
        "provider":"WS",
        "balance":52,
        "limit":3000000
    }],
    "creditLineIds":{
        "IS":0,
        "UX":1,
        "OS":2,
        "WS":3
    }
}

var creditLineIds = result.creditLineIds

var lineIds = []

for (let key in creditLineIds) {
    lineIds.push(key)
    console.log('key: ', key, 'value: ', creditLineIds[key])
}

function getProvidersHTML (creditLines) {
    var creditLinesHTML = ''

    for (var i = 0; i < creditLines.length; i++) {
        creditLinesHTML = creditLinesHTML + `
            <div id="provider${creditLines[i].provider}">
                <b>Provider</b>: <em>${creditLines[i].provider}</em><br>
                <b>Balance</b>: <em>${creditLines[i].balance}</em><br>
                <b>Limit</b>: <em>${creditLines[i].limit}</em>
            </div>
        `
    }

    var providersHTML = `
        <div id="providers">
            ${creditLinesHTML}
        </div>
    `

    return providersHTML
}