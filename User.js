const fs = require('fs')
const authObject = JSON.parse(fs.readFileSync('./auths.json', 'utf8'))

function writeAuths(authsObj) {
    fs.writeFile('auths.json', JSON.stringify(authsObj), function () {
        console.log('written to auths.json')
    })
}

function User (credentialsObject) {
    if (credentialsObject.Action === 'AddUser') {
        authObject[credentialsObject.user] = credentialsObject.pass
        writeAuths(authObject)
        return { userAdded: true }
    }
}

exports.User = User