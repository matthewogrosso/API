const fs = require('fs')

function AddUser (credentialsObject) {
    const authObject = JSON.parse(fs.readFileSync('./auths.json', 'utf8'))
    if (credentialsObject.user && credentialsObject.pass) {
        if (authObject[credentialsObject.user]) {
            return { 
                AddUserSuccess: false, 
                Message: credentialsObject.user + " already exists.",
                LocalStorageLoggedIn: 'none'
            }
        } else {
            authObject[credentialsObject.user] = {
                pass: credentialsObject.pass
            }
    
            fs.writeFile('./auths.json', JSON.stringify(authObject), function(err) {
                if (err) throw err;
                console.log('AddUser ' + credentialsObject.user + ' Success.');
            })
    
            return { 
                AddUserSuccess: true, 
                Message: credentialsObject.user + ' added to users.',
                LocalStorageLoggedIn: credentialsObject.user
            }
        }
    } else {
        return { 
            AddUserSuccess: false, 
            Message: "User and password must be present on credentialsObject.",
            LocalStorageLoggedIn: 'none'
        }
    }
}

exports.AddUser = AddUser