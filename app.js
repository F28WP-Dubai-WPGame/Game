var mongojs = require("mongojs"); // using mongodb as our database.
var db = mongojs('mongodb+srv://abdullah:discord123@@pacman.gwmyn.mongodb.net/myGame?retryWrites=true&w=majority/myGame', ['account']); // cloud mongodb to store sign in details.


var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
serv.listen(port, function () {
  console.log('Server is up and running!');
});

var SOCKET_LIST = {};

var isValidPass = function (data, cb) {         // checking if the password and username match
  db.account.find({ username: data.username, password: data.password }, function (err, res) {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  });
}
var isUserTaken = function (data, cb) {         // checking if the username is taken
  db.account.find({ username: data.username }, function (err, res) {
    if (res.length > 0)
      cb(true);
    else
      cb(false);
  });
}
var addUser = function (data, cb) {              // inserting the user details into our database.
  db.account.insert({ username: data.username, password: data.password }, function (err) {
    cb();
  });
}


var uniqueCodes = [200, 300, 400, 500];                          // unique codes assigned to each player
var currentScores = [0, 0, 0, 0]                                 // storing scores of each player in an array
var userNames = ["Player 1", "Player 2", "Player 3", "Player 4"]                                               // storing usernames of the players in an array
io.sockets.on('connection', function (socket) {                  // socket connection

  socket.on('player-joined', function () {                       // when a player joins we assign them a unique code
    let temp = uniqueCodes.pop();
    socket.emit('pacman-code', { playerCode: temp })
    console.log(temp);
  })

  setInterval(function () {
    socket.on('updateScores', function (data) {                  // updating scores for each player
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

    socket.emit('allScores', currentScores)                      // emiting the scores and usernames of all players 
    socket.emit('allPlayers', userNames)

  }, 100)                                                        // all of this is happening every 100 milliseconds

  socket.on('currentUserName', function (data) {                 // updating usernames for each player
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

  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('signIn', function (data) {                    // signing in
    isValidPass(data, function (res) {
      if (res) {
        socket.emit('signInResponse', { success: true });
      }
      else {
        socket.emit('signInResponse', { success: false });
      }
    });
  });
  socket.on('signUp', function (data) {                 // signing up
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

  });

  socket.on('sendMsgToServer', function (data) {                     // chat
    var playerName = data[1];
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data[0]);
    }
  });

});
