var server = require('http').createServer(handler),
    io = require('socket.io').listen(server),
    fs = require('fs');

var chatHistory = [];

server.listen(3000);

function handler(req, res) {
  fs.readFile(process.cwd() + '/client/index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// event thrown in case of new client-connections
io.sockets.on('connection', function (socket) {
    socket.emit("initChat", chatHistory);
    
    socket.on("sendChatMessage", function(messageObj) {
        chatHistory.push(messageObj);        
        socket.broadcast.emit("updateOtherChatMessage", messageObj);
        console.log("incoming: ", messageObj);
    })
});

