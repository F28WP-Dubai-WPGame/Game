const { log } = require('console');
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(3000, function () {
  console.log("Server started on http://localhost:3000/");
});

var SOCKET_LIST = {};

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {

  socket.id = Math.random();
  socket.currentIndex = 0;
  SOCKET_LIST[socket.id] = socket;

  socket.on('disconnect', function () {
  });
});

setInterval(function () {
  var pack = [];

  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    pack.push({
      currentIndex: socket.currentIndex
    })
  }

  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPosition', pack)
  }

}, 1000 / 25)