const nodes = [ 
    {
        usage: 'API',
        port: 8087,
        fileName: 'api.js'
    },
    {
        usage: 'Charge & Pay UI',
        port: 8081,
        fileName: 'accountUI.js'
    },  
    {
        usage: 'Credit Providers Reporting',
        port: 8082,
        fileName: 'creditUI.js'
    },
    //{
        //usage: 'System Checks',
        //port: 8083,
        //fileName: 'systemChecks.js'
    //},
    {
        usage: 'Scaled Text Entry',
        port: 8084,
        fileName: 'scaledTextEntry.js'
    }
]

exports.nodes = nodes