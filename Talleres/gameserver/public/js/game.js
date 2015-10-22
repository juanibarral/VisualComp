var socket = io.connect();
var playerId;
var players;

socket.on("joined", function(msg){
	console.log(msg);
	playerId = msg.number;
});
socket.on("new_player", function(msg){
	console.log(msg);
	players = msg;
});
socket.on("player_moved", function(msg){
	console.log(msg);
	players = msg;
});


var canvas;

window.onload = function()
{
	canvas = document.getElementById("myCanvas");
	canvas.addEventListener("mousemove", onMouseMove, false);
};


function joingame(){
	socket.emit("join_game", {
		name : name
	});
} 

function onMouseMove(evt){
	socket.emit("move_player", {
		id : playerId,
		pos : {
			x : evt.pageX,
			y : evt.pageY
		}
	});
}
