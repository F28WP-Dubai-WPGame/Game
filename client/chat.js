var today = new Date;
document.getElementById('date').innerHTML = today.getHours() + ":" + today.getMinutes();

socket.on('addToChat', function (data) {
  chatText.innerHTML += '<div class="container darker\"><img src="client/favicon.jpg" alt="Avatar" class="left" style="width:100%;"><p>' + data + '</p><span id="date" class="time-left">11:05</span></div>';
});

chatForm.onsubmit = function (e) {
  e.preventDefault();
  if (chatInput.value[0] === '/')
    socket.emit('evalServer', chatInput.value.slice(1));
  else
    socket.emit('sendMsgToServer', chatInput.value);
  chatInput.value = '';
}