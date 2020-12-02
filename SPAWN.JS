const { spawn, exec } = require("child_process");
var fs = require('fs');
const {nodes} = require('./NODES')
const nextNode = fs.readFileSync('./NextNodeArrayLocation', 'utf8')


const node = spawn("node", ["systemChecks.js"]);

function reSpawn (nextNodeFilename) {
    if (nextNodeFilename) {
        let command = 'node ' + nextNodeFilename
    } else {
        const reSpawnFileName = JSON.parse(fs.readFileSync('./LastNodeChecked.json', 'utf8')).fileName
        let command = 'node ' + reSpawnFileName
    }

    exec(command, (error, stdout, stderr) => {
        console.log(`exec_stdout: ${stdout}`)
        console.log(`intern: ${process.version} '${command}'`)
    })
}

reSpawn(nodes[nextNode].filename)

node.stdout.on("data", data => {
    console.log(`spawn_stdout: ${data}`);
});

node.stderr.on("data", data => {
    //console.log(`stderr: ${data}`);
    reSpawn()
});

node.on('error', (error) => {
    //console.log(`error: ${error.message}`);
    reSpawn()
});

node.on("close", code => {
    //console.log(`child process exited with code ${code}`);
    reSpawn()
});