var port = 8000;
var express = require('express');
var app = express();
var serverUrl = app.get('port');//"127.0.0.1";

var http = require("http");
var path = require("path"); 
var fs = require("fs"); 

var Sockets = {};	

//console.log("Starting web server at " + serverUrl + ":" + port);

var server = http.createServer( function(req, res) 
{

	var now = new Date();

	var filename = req.url || "index.html";
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = 
	{
		".html" : "text/html",			
		".js": "application/javascript", 
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".mp3": "application/force-download",
		".png": "image/png",
		".ico": "icon"
	};
	//console.log("toto " + localPath);
	var isValidExt = validExtensions[ext];

	if (isValidExt) {
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				//console.log("Serving file: " + localPath);
				getFile(localPath, res, ext);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext);
	}

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
	
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			res.setHeader("Content-Type", mimeType);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

var io = require('socket.io')(server);

io.on('connection', function(socket) 
{
	Sockets[socket.id] = socket;
	socket.emit('CheckConnection',socket.id);
	socket.on("ConnectionOK",function (socketID) 
	{
		Clients.push(socketID);
		console.log('Player Connected', socketID , "Nb",Clients.length);
		io.emit('PlayersConnected',Clients.length)
	});
	
	socket.on('restartgame', function (data) 
	{
		console.log('restartgame');
		socket.broadcast.emit('restart');
	});
	socket.on('disconnect', function (data) 
	{

		console.log("Player Disconected");

	});
	socket.on('Ready', function (data) 
	{
		console.log('Ready')
		var length = Clients.length * 2;
		var sp = SetPosition(length);
		var mycolors = SetColors();
		for (var i = 0; i < Clients.length; i++) 
		{
			var myData = 
			{
				id: i,
				StartPos: sp,
				Colors: mycolors
			};
			Sockets[Clients[i]].emit('StartGame',myData);
		}
	})
});

var Clients = [];
var Players = [];

// Import Random.js
Math.Random = {};
Math.Random.RangeInt = function(_min, _max, _isInclusive)
{
	if(typeof _min != 'number') PrintErr("Parameter minimum in RangeInt");
    if(typeof _max != 'number') PrintErr("Parameter maximum in RangeInt");
    if(typeof _isInclusive != 'boolean') PrintErr("Parameter isInclusive in RangeInt");
	_isInclusive ? _max++ : _min++;
	return Math.floor(Math.random() * (_max - _min) + _min); 
};
Math.Random.ColorHEX = function() 
{
	var letters = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    var color = '#';
    for (var i = 0; i < 6; i++ )
    {
        color += letters[Math.Random.RangeInt(0,letters.length,false)];
    }
    return color;
};

function SetPosition(_length) 
{
	var sp = [];
	for (var i = 0; i < Clients.length; i++) 
	{
		var v = {
			x: Math.Random.RangeInt(0,_length - 1,true),
			y: Math.Random.RangeInt(0,_length - 1,true)
		};
		for (var j = 0; j < sp.length; j++) 
		{
			if (sp[j].x == v.x && sp[j].y == v.y) 
			{
				i--;
				break;
			}
		}
		sp.push(v);
	}
	return sp;
}
function SetColors() 
{
	var colors = [];
	for (var i = 0; i < Clients.length; i++) 
	{
		var c =Math.Random.ColorHEX();
		for (var j = 0; j < colors.length; j++) 
		{
			if (colors[j] == c) 
			{
				i--;
				break;
			}
		}
		colors.push(c);
	}
	return colors;
}