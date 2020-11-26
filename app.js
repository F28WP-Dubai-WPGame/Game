var mongojs = require("mongojs");
var db = mongojs('mongodb+srv://abdullah:discord123@@pacman.gwmyn.mongodb.net/myGame?retryWrites=true&w=majority/myGame', ['account']);


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
  console.log('Server in up and running!');
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

var time = 60;
var count = 0;
var clientNo = 0;
var uniqueCodes = [200, 300, 400, 500];
var currentScores = [0, 0, 0, 0]
var userNames = ["Player 1", "Player 2", "Player 3", "Player 4"]
io.sockets.on('connection', function (socket) {
  count++;
  console.log(count);
  // //Increase roomno 2 clients are present in a room.
  // if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
  //   roomno++;
  //   socket.join("room-" + roomno);
  // }


  // //Send this event to everyone in the room.
  // io.sockets.in("room-" + roomno).emit('connectToRoom', "You are in room no. " + roomno);

  clientNo++;
  roomNo = Math.round(clientNo / 2);
  //Server puts client in a room with the room number as its name 
  socket.join(roomNo);
  socket.emit('roomNum', roomNo)

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

    socket.emit('allScores', currentScores)
    socket.emit('allPlayers', userNames)

    // console.log(currentScores);
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
    // if (userNames[0] !== "Player 1" && userNames[1] !== "Player 2" && userNames[2] !== "Player 3" && userNames[3] !== "Player 4") {
    //   socket.emit('startGame')
    // }
  })

  setInterval(function () {
    for (x in currentScores) {
      if (currentScores[x] = 175) {
        socket.emit('player-won', userNames[x])
      }
    }
  }, 300)


  setInterval(function () {
    // console.log(userNames);
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

  });



  socket.on('sendMsgToServer', function (data) {
    var playerName = ("" + socket.id).slice(2, 7);
    for (var i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
    }
  });

});

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

// window.onload = function () {
//   var fiveMinutes = 60,
//     display = document.querySelector('#timer');
//   startTimer(fiveMinutes, display);
// };

// app.get('/test', function (req, res) {
//   res.sendFile(__dirname + '/client/test.html');
// });

// app.post('/test', function (req, res) {
//   // setTimeout(function () {
//   //   res.redirect('/')
//   // }, 5000)
//   res.redirect('/')
// })


// io.sockets.on('connection', function (socket) {


// })
