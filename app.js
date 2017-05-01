/*
express used as the web framework
socket io for integrating pub sub model for real time tracking of mongodb database
chalk used for simple styling of console outputs.
ejs used as the templating engine
*/
var express=require('express')
var io=require('socket.io')
var sha256=require('crypto-js/sha256')
var jsonfile=require('jsonfile')
var chalk=require('chalk')
var path=require('path')
var bodyParser = require('body-parser')//body-parser to actually use get stuff from post

var db=require('DB/DbOps.js')
db.connectToDB //connects to the database required

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
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

//just logging that the server has started
console.log(chalk.blue('Server started!!!'))

//read json file for password
var passFile=jsonfile.readFileSync('adminKey.json')

app.get('/', function(req, res){
    res.render('index')
});

app.get('/admin', function(req, res){
    res.render('admin')
});

app.get('/userHome/:email', function (req, res){
    var email=req.params.email
    var userExists=db.read.userExists(email)
    if(userExists==1)
        {
            //you do not have to create a user
            console.log(chalk.green('user exists'))
        }
    else
    {
        db.insert.insertUser(email)
    }
    res.render('userHome')
})

app.get('/userSuccess', function(req, res){
    res.render('userSuccess')
})

app.post('/adminHome', function(req, res){
    var password=req.body.password
    var key=sha256(password)
    if (key==passFile.secret_key)
    {
        res.render('adminHome')
    }
    else
    {
        res.render('adminAccessDenied')
    }
})

app.get('/adminSuccess/:characterName/:location/:relationship/:job/:assignment', function(req, res){
    //according to express documentation route paths can be configured this way to get route parameters
    var data={
        "characterName":req.params.characterName,
        "location":req.params.location,
        "relationship":req.params.relationship,
        "job":req.params.job,
        "assignment":req.params.assignment
    }
    db.insert.insertGSData(data)
    res.render('adminHome')
})