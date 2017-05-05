/*
express used as the web framework
socket io for integrating pub sub model for real time tracking of mongodb database
chalk used for simple styling of console outputs.
ejs used as the templating engine
*/
var express=require('express')
var session=require('express-session')
var io=require('socket.io')
var http=require('http')
var sha256=require('crypto-js/sha256')
var jsonfile=require('jsonfile')
var chalk=require('chalk')
var path=require('path')
var file='config.json'
var async=require('async')
var bodyParser = require('body-parser')//body-parser to actually use get stuff from post

var users=[]//to maintain emails for users

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
var userSocket=null
var server=null
server=app.listen(4000)
userSocket=require('socket.io').listen(server)

//setting the view engine, in this case embedded javascript or ejs
app.set('view engine', 'ejs')
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/*
This middleware is simply going to be code executed between the request and response life-cycle of your application
Any static file is assumed to be living in your public directory.
*/ 
//middleware
app.use(express.static(path.join(__dirname, 'public')))
var sessionSecret=(jsonfile.readFileSync('sessionSecret.json')).secret
app.use(session({
  cookieName:'session',
  secret:sessionSecret,
  duration:30*60*1000,
  activeDuration:5*60*1000
}));

//method to start a session
function startSession(req,email)
{
  req.session.email=email;
}

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
async.series([function(callback){
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
    // server=app.listen(4000)
    //configuring the socket
    var httpServer=http.createServer()
    httpServer.listen(1337)
    console.log(chalk.blue('http server started and listening at port 1337'))
    io=io.listen(httpServer)
    console.log(chalk.blue('express Server started, socket initialized!!!'))
    callback(null)

})
}

], function(err, results){

    //--------------------------------------------Socket for sending data to clients--------------------------------
    // userSocket=require('socket.io').listen(server)//configuring to listen for connections into the same port of express
    
    //--------------------------------------------Socket connection for com. between server and tailableCursor client------

    io.sockets.on('connection', function(client){
      console.log('socket started')
    //newData is the event or the message that the client sends to get a response
    client.on('newData', function(data){//data here is the data it is getting, newData is the message sent by the client for the server to capture.
        var data=data.data
        /*
        data to be sent in the following form:
        data.characterName, data.location, data.relationship, data.job, data.assignment
        */  
        async.series([function(callback){
            db.read.checkUserSubscription(dbInstance, data, callback)
            
            
        }], function(err, results){
            //here results[0] actually contains array of users who had subscribed to the change in the database and so all that information must be persistent and stored in the user's collection
            db.insert.insertNotifications(dbInstance, results[0], data)
            sendLog(results[0], data)
        })
    })
})  
})

//------------------------------------------connect to database done----------------------------------------------

app.get('/', function(req, res){
    if (req.session && req.session.email){
        res.render('userHome')
    }
    else{
        res.render('index') 
    }
});

app.get('/admin', function(req, res){
    res.render('admin')
});

app.get('/logout', function(req, res){
    if(req.session && req.session.email){
        req.session.destroy(function(err){
            console.log(chalk.red('session destroyed'))
        })
    }
    res.render('index')
})

app.post('/userHome', urlencodedParser, function (req, res){
    var email=req.body.email

    users.push(email)

    async.series([function(callback){

        if(!(req.session && req.session.email)){
            console.log(chalk.green('starting session'))
            startSession(req, email)
        }
        callback(null)

    },function(callback){

        db.read.userExists(dbInstance, email, callback)
    }
    ], function(err, result){

        if(result[1]==1){
            //you do not have to create a user
            console.log(chalk.green('user exists'))
        }
        else{
            console.log(chalk.red('user does not exist'))
            db.insert.insertUser(dbInstance, email)
        }
        res.render('userHome')

                
    })
    
})

app.post('/userSuccess', urlencodedParser, function(req, res){

    /*var email=req.params.email*/
    if(req.session && req.session.email){
            console.log(chalk.green('session exists'))
            
            var email=req.session.email
            console.log('req.body: '+JSON.stringify(req.body))
            var data={
            characterName:req.body.characterName,
            location:req.body.location,
            relationships:req.body.relationships,
            job:req.body.job,
            assignment:req.body.assignment
            }

            //cleaning the data
            if(data.location==null){
                data.location='false'
            }
            else{
                data.location='true'
            }
            if(data.relationships==null){
                data.relationships='false'
            }
            else{
                data.relationships='true'
            }
            if(data.job==null){
                data.job='false'
            }
            else{
                data.job='true'
            }
            if(data.assignment==null){
                data.assignment='false'
            }
            else{
                data.assignment='true'
            }

            db.insert.insertCharacterSubscriptions(dbInstance, email, data)
            setTimeout(function(){
                res.render('userHome')
            }, 2000)
            
    }
    else{
        res.render('/')
    }
})


app.post('/adminHome', urlencodedParser, function(req, res){
    if (!req.body)
        return res.sendStatus(400)
    var password=req.body.password
    var key=sha256(password)
    var secret_key=JSON.stringify(passFile.secret_key)
    var password=JSON.stringify(key)
    if (secret_key==password)
    {
        console.log('matched')
        res.render('adminHome')
    }
    else
    {
        console.log(chalk.red('not matched'))
        res.render('adminAccessDenied')
    }
})

app.post('/adminSuccess', urlencodedParser, function(req, res){
    //according to express documentation route paths can be configured this way to get route parameters
    if (!req.body)
        return res.sendStatus(400)
    var data={
        character_name:req.body.characterName,
        location:req.body.location,
        relationships:req.body.relationship,
        job:req.body.job,
        assignment:req.body.assignment
    }

    console.log('data for adminSuccess:'+JSON.stringify(data))

    db.insert.insertGSData(dbInstance, data)
    res.render('adminHome')
})

userSocket.sockets.on('connection', function(client){
    console.log(chalk.blue('a client got connected'))

    //during the connection of a new client we can send the data of any persistent notifications of the user to the user

    var userEmail=users[users.length-1]

    client.join(userEmail)
    async.series([function(callback){
        db.read.checkUserNotifications(dbInstance, userEmail, callback)
    }], function(err, results){
        
        var docs=results[0]

        var document

        if(docs!=null){
            for(var i=0;i< docs.length;i++){
                document=docs[i]
                console.log(chalk.blue('emitting new document:'+JSON.stringify(document)))
                userSocket.in(userEmail).emit('newLogData', {data:document})//emitting documents one by one
            }
        }
    })
    
    

    client.on('disconnect', function(){
        console.log(chalk.red('a client got disconnected'))
    })

})

function sendLog(message, data){
    console.log('at sendLog')
    console.log('message now:'+message)
    if(userSocket==null){
        console.log('userSocket is null')
    }
    var i=0
    for(i=0; i<message.length;i++){
        console.log(chalk.blue('emiting now to email:'+message[i]))
        userSocket.in(message[i]).emit('newLogData', {data:data})//users.email is a socket object corresponding to that client
    }
}


