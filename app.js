var mongojs = require("mongojs");
var db = mongojs('localhost:27017/myGame', ['account']);


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


var isValidPass = function (data, cb) {
  db.account.find({ username: data.username, password: data.password }, function (err, res) {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  });
}
var isUserTaken = function (data, cb) {
  db.account.find({ username: data.username }, function (err, res) {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  });
}
var addUser = function (data, cb) {
  db.account.insert({ username: data.username, password: data.password }, function (err) {
    cb();
  });
}

var uniqueCodes = [200, 300, 400, 500];
var currentScores = [0, 0, 0, 0]
var userNames = ["Player 1", "Player 2", "Player 3", "Player 4"]
io.sockets.on('connection', function (socket) {

  socket.on('player-joined', function () {
    let temp = uniqueCodes.pop();
    socket.emit('pacman-code', { playerCode: temp })
    console.log(temp);
  })

  setInterval(function () {
    socket.on('updateScores', function (data) {
      if (data.code == 500) {
        currentScores[0] = data.currentScore;
      } else if (data.code == 400) {
        currentScores[1] = data.currentScore;
      } else if (data.code == 300) {
        currentScores[2] = data.currentScore;
      } else if (data.code == 200) {
        currentScores[3] = data.currentScore;
      }
    })
  }, 100)

  socket.on('currentUserName', function (data) {
    if (data.code == 500) {
      userNames[0] = data.clientName;
    } else if (data.code == 400) {
      userNames[1] = data.clientName;
    } else if (data.code == 300) {
      userNames[2] = data.clientName;
    } else if (data.code == 200) {
      userNames[3] = data.clientName;
    }
  })

  setInterval(function () {
    console.log(userNames);
  }, 3000)

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', function (data) {
    isValidPass(data, function (res) {
      if (res) {
        // Player.onConnect(socket);
        socket.emit('signInResponse', { success: true });
      }
      else {
        socket.emit('signInResponse', { success: false });
      }
    });
  });
  socket.on('signUp', function (data) {
    isUserTaken(data, function (res) {
      if (res) {
        socket.emit('signUpResponse', { success: false });
      }
      else {
        addUser(data, function () {
          socket.emit('signUpResponse', { success: true });
        });
      }
    });
  });

  socket.on('disconnect', function () {
    // delete SOCKET_LIST[socket.id];
    // Player.onDisconnect(socket);
  });



  socket.on('sendMsgToServer', function (data) {
    var playerName = ("" + socket.id).slice(2, 7);
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
    }
  });

});

// setInterval(function () {
//   var pack = [];

//   for (var i in Player.list) {
//     var player = Player.list[i];
//     player.updatePosition();
//     pack.push({
//       currentIndex: player.currentIndex
//     })
//   }
//   for (var i in SOCKET_LIST) {
//     var socket = SOCKET_LIST[i];
//     socket.emit('newPositions', pack)
//   }
// }, 1000 / 5)
