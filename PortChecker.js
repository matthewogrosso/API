const { exec, spawn } = require("child_process")
const { nodes } = require('./NODES')
var onlyPortsArray = []

function match(port, portsArray) {
    for (var i = 0; i < portsArray.length; i++) {
        if (port == portsArray[i]) {
            return true
        }
    }

    return false
}

exec('netstat -lntp | grep node', (error, stdout, stderr) => {
    if (error) {
        //console.log(`error: ${error.message}`)
        return
    }
    if (stderr) {
        //console.log(`stderr: ${stderr}`)
        //return
    }
    var nodeProcessLines = stdout.replace(/ /g, '_')
    var portFirstLines = nodeProcessLines.replace(/tcp6_______0______0_:::/g, '')
    //console.log(portFirstLines)
    var onlyPortsLines = portFirstLines.replace(/_________________.*node_________/g, '')
    //console.log(onlyPortsLines)
    var activeNodePortsArray = onlyPortsLines.split(/\n/)
    //console.log(activeNodePortsArray)
    onlyPortsArray = activeNodePortsArray.slice(0, activeNodePortsArray.length - 1)
    console.log(onlyPortsArray)

    for (var i = 0; i < nodes.length; i++) {
        if (match(nodes[i].port, onlyPortsArray)) {
            console.log(nodes[i].port + ' is active.')
        } 
         
        if (!match(nodes[i].port, onlyPortsArray)) {
            exec('node ' + nodes[i].fileName, (error, stdout, stderr) => {
                console.log(`exec: 'node ' + ${nodes[i].fileName}`)
                console.log(`exec_stdout: ${stdout}`)
                console.log(`exec_stderr: ${stderr}`)
            })
        }
    }

    //console.log(`exec_stdout: ${stdout}`)
    //console.log(`exec_stderr: ${stderr}`)
})

