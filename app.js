var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(3000, function () {
  console.log("Server started on http://localhost:3000/");
});

var SOCKET_LIST = {};
var PLAYER_LIST = {};

function Player(id, startIndex) {
  var self = {
    currentIndex: startIndex,
    id: id,
    number: "" + Math.floor(10 * Math.random()),
    pressingRight: false,
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    width: 20,
  }
  self.updatePosition = function () {
    if (self.pressingRight)
      self.currentIndex += 1;
    if (self.pressingLeft)
      self.currentIndex -= 1;
    if (self.pressingUp)
      self.currentIndex -= self.width;
    if (self.pressingDown)
      self.currentIndex += self.width;
  }
  return self;
}


io.sockets.on('connection', function (socket) {

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  var player = Player(socket.id, 288);
  PLAYER_LIST[socket.id] = player;

  socket.on('disconnect', function () {
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
  });

  socket.on('keyPress', function (data) {
    if (data.inputId === 'left')
      player.pressingLeft = data.state;
    else if (data.inputId === 'right')
      player.pressingRight = data.state;
    else if (data.inputId === 'up')
      player.pressingUp = data.state;
    else if (data.inputId === 'down')
      player.pressingDown = data.state;
  });

  socket.on('sendMsgToServer', function (data) {
    var playerName = ("" + socket.id).slice(2, 7);
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
    }
  });

});

setInterval(function () {
  var pack = [];

  for (var i in PLAYER_LIST) {
    var player = PLAYER_LIST[i];
    player.updatePosition();
    pack.push({
      currentIndex: player.currentIndex
    })
  }

  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions', pack)
  }

}, 1000 / 10)