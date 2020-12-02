const fs = require('fs')

function Authenticate (credentialsObject) {
    const authObject = JSON.parse(fs.readFileSync('./auths.json', 'utf8'))

    console.log(credentialsObject)

    if (credentialsObject.user && credentialsObject.pass) {

        console.log(authObject[credentialsObject.user])

        if (authObject[credentialsObject.user]) {
            if (authObject[credentialsObject.user].pass === credentialsObject.pass) {
                return { 
                    LocalStorageLoggedIn: credentialsObject.user,
                    authenticated: true }
            } else {
                return { 
                    LocalStorageLoggedIn: "none",
                    authenticated: false }
            }
        } else {
            return { 
                LocalStorageLoggedIn: "none",
                authenticated: false }
        }
    } else {
        return { authenticationError: "Error: user and pass not sent with credentialsObject." }
    }
    
}

exports.Authenticate = Authenticate