var http = require('http')
const {writeAccessLog} = require('./WriteAccessLog')

http.createServer((request, response) => {
  var remoteAddress = request.connection.remoteAddress
  
  writeAccessLog(remoteAddress + '\t,\t' + '8083API' + '\t,\t' + new Date() + '\n')

  const { headers, method, url } = request

    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end()
    }
}).listen(8083)