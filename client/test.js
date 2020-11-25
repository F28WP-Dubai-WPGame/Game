var socket = io();
var testDiv = document.getElementById('test');

socket.on('change', function () {
  testDiv.innerHTML = "changed"
})