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
var rect;
var ctx;
var point1 = [0,0];

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
	
	//console.log(evt);
	rect = canvas.getBoundingClientRect();
	var point2 = [evt.clientX - rect.left,evt.clientY - rect.top];
	ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(point1[0], point1[1]);
	ctx.lineTo(point2[0], point2[1]);
	ctx.closePath();
	ctx.stroke();
	
	//ctx.fillRect(point2[0], point2[1], 50, 50);
	
	point1 = point2;
	
	socket.emit("move_player", {
		id : playerId,
		pos : {
			x : point2[0],
			y : point2[1]
		}
	});
}
