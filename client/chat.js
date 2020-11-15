var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');

var today = new Date;
var socket = io();
document.getElementById('date').innerHTML = today.getHours() + ":" + today.getMinutes();

socket.on('addToChat', function (data) {
  chatText.innerHTML += '<div class="container darker\"><img src="client/favicon.jpg" alt="Avatar" class="left" style="width:100%;"><p>' + data + '</p><span id="date" class="time-left">11:05</span></div>';
});

chatForm.onsubmit = function (e) {
  e.preventDefault();
  socket.emit('sendMsgToServer', chatInput.value);
  chatInput.value = '';
}