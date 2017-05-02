/*
This is the client module that actually informs the server of changes made. In case of a client-server messaging application, the message is obviously generated by the client and the server only responds. 
*/ 

var socketPort  = 3100; 

var express  = require('express');
var app      = express();
var http     = require('http');
var server   = http.createServer(app);
var io       = require('socket.io').listen(server);

var mongo = require("mongodb");

var mongodbUri = "mongodb://127.0.0.1/GossipGirl";

io.sockets.on('connection',function(server){
    mongo.MongoClient.connect (mongodbUri, function (err, db) {

    db.collection('GSCharacterLog', function(err, collection) {
    // open a tailable cursor
    console.log("== open tailable cursor");
    collection.find({}, {tailable:true, awaitdata:true, numberOfRetries:-1})
                      .sort({ $natural: 1 })
                      .each(function(err, doc) {
    //everytime there is a new document simply broadcast it to the server so that the server can throw up the ui for the user
    server.broadcast.emit('newData', {data: doc})
        })
    });

    });

    

})
