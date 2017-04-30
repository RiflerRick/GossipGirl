/*
express used as the web framework
socket io for integrating pub sub model for real time tracking of mongodb database
chalk used for simple styling of console outputs.
ejs used as the templating engine
*/
var express=require('express');
var io=require('socket.io');
var chalk=require('chalk');

var app=express();
var server=app.listen(4000);

// socket io also listening to that same server
io.listen(server); 

//setting the view engine, in this case embedded javascript or ejs
app.set('view engine', 'ejs');

//just logging that the server has started
console.log(chalk.blue('Server started!!!'))

app.get('/', function(req, res){
    res.render('index')
});
