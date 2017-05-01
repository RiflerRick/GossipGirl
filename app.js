/*
express used as the web framework
socket io for integrating pub sub model for real time tracking of mongodb database
chalk used for simple styling of console outputs.
ejs used as the templating engine
*/
var express=require('express')
var io=require('socket.io')
var chalk=require('chalk')
var path=require('path')

var app=express()
var server=app.listen(4000)

// socket io also listening to that same server
io.listen(server);

//setting the view engine, in this case embedded javascript or ejs
app.set('view engine', 'ejs')

/*
This middleware is simply going to be code executed between the request and response life-cycle of your application
Any static file is assumed to be living in your public directory.
*/ 
//middleware
app.use(express.static(path.join(__dirname, 'public')))

//just logging that the server has started
console.log(chalk.blue('Server started!!!'))

app.get('/', function(req, res){
    res.render('index')
});

app.get('/admin', function(req, res){
    res.render('admin')
});

app.get('/userHome', function (req, res){
    var email=req.email
    
    res.render('userHome')
})

app.get('/userSuccess', function(req, res){
    res.render('userSuccess')
})

app.get('/adminHome', function(req, res){
    res.render('adminHome')
})

