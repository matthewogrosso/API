const { exec } = require('child_process')

const command = process.argv[2]

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`)
        //return
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`)
        //return
    }
    console.log(`stdout: ${stdout}`)
    console.log(`intern: ${process.version}`)
})