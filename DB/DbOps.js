var path=require('path')
var jsonfile=require('jsonfile')
var file='config.json'
var chalk=require('chalk')
var GSDocStructure=require('gsDocStructure.json')
var userDocStructure=require('userDocStructure.json')

/*
reading of the config json file has to be a synchronous operation as the contents of the file are crucial to the correct working of the rest of the application

The jobs performed in this file are:
1. Connecting to the database
2. Make the collection necessary(in this case a capped collection of size 1000)
3. insert the sample data
*/

var obj=jsonfile.readFileSync(file)
var host=obj.host
var port=obj.mongoDBPort
var databaseName=obj.databaseName
var GSCollection=obj.GSCollection
var userCollection=obj.userCollection


// import the language driver
var mongodb=require('mongodb')
var MongoClient = mongodb.MongoClient
var assert = require('assert')

var ObjectID = require('mongodb').ObjectID

//construct url
var url = 'mongodb://'+host+':'+port+'/'+databaseName

var database;

MongoClient.connect(url, function(err, db){
    if(err)
    {
        return console.log(chalk.red('could not connect to the database'))
    }

    console.log('connected to mongoDB server!!!')

    database=db

    //once connected to the mongodb database we can create a capped collection
    db.createCollection(GSCollection, {capped: true, size: 1000}, function(err, collection){
        //so once the collection is created we can insert documents inside of it
        if(err)
        {
            return console.log(chalk.red('could not create the collection'))
        }

        var sampleData=jsonfile.readFileSync('sampleData.json')
        collection.insert(sampleData, function(err, result){
            if(err)
            {
                return console.log(chalk.red('could not insert the documents'))
            }
        })

    })
    return;
    // return db.close();
})

/*
Below is a crude but one of the possible ways of implementing code where we can pass variable data across modules. There are other techniques using proper object oriented design paradigms but this is short and simple. We do not need to care about objects and classes, we can simply do that functionally
*/ 
exports.insert={
    insertUser:function insertData(email){
        //here data is simply a json document that has to be inserted, user data that is users' email address and the characters they have subscribed to are stored
        //here when we are inserting a user we assume that the user does not exist before hand

        //creating the document from layout given in userDocStructure

        database.collection(userCollection,function(err, collection){
            collection.insert(data)
            console.log(chalk.green("user successfully written to database"))
        })
    
    },
    insertGSData:function insertData(data){
        //log for maintaining gossip girl character records
        database.collection(GSCollection,function(err, collection){
            collection.insert(data)
            console.log(chalk.green("user successfully written to database"))
        })
    }

}

exports.read={
    userExists:function readData(email){
        //returns if the user of that email exists
    },
    userSubsciption: function readData(email){
        //returns the fields that the user has subscribed to
    }
}