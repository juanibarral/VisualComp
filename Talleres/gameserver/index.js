var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var surface;
var players = {};

var Player = function(params)
{
	this.name = "";
	this.id = 0;
	this.position = {
		x : 0,
		y : 0,
		z: 0
	};
};


io.on('connection', function(socket) {
	
	socket.on('join_game', function(msg){
		console.log("player joined: " + msg.name);
		var p = new Player();
		p.id = Object.size(players);
		p.name = msg.name;
		players[p.id] = p;
		
		socket.emit("joined", {
			number : p.id,
		});
		io.emit("new_player",{
			players : players
		});
	});
	
	socket.on('move_player', function(msg){
		var p = players[msg.id];
		if(p)
		{
			p.position.x = msg.pos.x;
			p.position.y = msg.pos.y;
			
			io.emit("player_moved", {
				players : players
			});
		}
	});
}); 


app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/views/home_client.html');
});

app.get('/surface', function(req, res) {
	res.sendFile(__dirname + '/public/views/SurfaceEditor.html');
});

var server = http.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
  
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
