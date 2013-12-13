


var serialport = require("serialport"),				// include the serialport library
	SerialPort  = serialport.SerialPort,			// make a local instance of serial
	app = require('express')(),						// start Express framework
  	server = require('http').createServer(app),		// start an HTTP server
  	io = require('socket.io').listen(server);		// filter the server using socket.io

var serialData = {};								// object to hold what goes out to the client
var info;
server.listen(8000);								// listen for incoming requests on the server

console.log("Listening for new clients on port 8000");

var myPort = new SerialPort("COM1", { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});

//      file creation location

fs = require('fs');
fs.writeFile('Data.txt',"");

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {

    // if there's a socket client, listen for new serial data:  
    myPort.on('data', function (data) {
        // set the value property of scores to the serial string:
        serialData.value = data;
        // for debugging, you should see this in Terminal:
        info = data;

        socket.on('append', function (info) {
            
                fs.appendFile('Data.txt', data, function (err) {
                    if (err) return console.log(err);
                    console.log(data);
                });
               
        });



        // send a serial event to the web client with the data:
        socket.emit('serialEvent', serialData);
    });
});
