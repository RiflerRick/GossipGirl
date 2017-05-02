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
var file='config.json'
var bodyParser = require('body-parser')//body-parser to actually use get stuff from post

var db=require('DB/DbOps.js')
db.connectToDB //connects to the database required

//---------------------------------------database config file read----------------------------
var obj=jsonfile.readFileSync(file)
var host=obj.host
var port=obj.mongoDBPort
var databaseName=obj.databaseName
var GSCollection=obj.GSCollection
var userCollection=obj.userCollection
//--------------------------------------database config file read over------------------------

var app=express()
var server=null

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

var dbInstance=null
var mongodb=require('mongodb')
var MongoClient = mongodb.MongoClient
var assert = require('assert')
var ObjectID = require('mongodb').ObjectID

//construct url
var url = 'mongodb://'+host+':'+port+'/'+databaseName

//--------------------------------------------connect to database----------------------------------------
MongoClient.connect(url, function(err, db){
    if(err)
    {
        return console.log(chalk.red('could not connect to the database'))
    }

    console.log('connected to mongoDB server!!!')

    dbInstance=db

    //once connected to the mongodb database we can create a capped collection
    
    db.createCollection(GSCollection, {capped: true, size: 1000}, function(err, collection){
        //so once the collection is created we can insert documents inside of it
        if(err)
        {
            return console.log(chalk.red('could not create the GS collection'))
        }

        var sampleData=jsonfile.readFileSync('sampleData.json')
        collection.insert(sampleData, function(err, result){
            if(err)
            {
                return console.log(chalk.red('could not insert the documents'))
            }
        })

    })

    //creating the user collection

    db.createCollection(userCollection, function(err, collection){
        if(err)
        {
            return console.log(chalk.red('could not create the user collection'))
        }
        return
    })
    //below is a key line as this ensures that the server starts only after the connection to the database is made
    server=app.listen(4000)
    console.log(chalk.blue('listening to port 4000'))
})

//------------------------------------------connect to database done----------------------------------------------

app.get('/', function(req, res){
    res.render('index')
});

app.get('/admin', function(req, res){
    res.render('admin')
});

app.get('/userHome/:email', function (req, res){
    var email=req.params.email
    var userExists=db.read.userExists(dbInstance, email)
    if(userExists==1)
        {
            //you do not have to create a user
            console.log(chalk.green('user exists'))
        }
    else
    {
        db.insert.insertUser(dbInstance, email)
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
        characterName:req.params.characterName,
        location:req.params.location,
        relationship:req.params.relationship,
        job:req.params.job,
        assignment:req.params.assignment
    }
    db.insert.insertGSData(dbInstance, sdata)
    res.render('adminHome')
})