var path=require('path')
var jsonfile=require('jsonfile')
var file='config.json'
var chalk=require('chalk')
var GSDocStructureFile='gsDocStructure.json'
var userDocStructureFile='userDocStructure.json'

var GSDocStructure=jsonfile.readFileSync(GSDocStructureFile)
var userDocStructure=jsonfile.readFileSync(userDocStructureFile)

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

/*
Below is a crude but one of the possible ways of implementing code where we can pass variable data across modules. There are other techniques using proper object oriented design paradigms but this is short and simple. We do not need to care about objects and classes, we can simply do that functionally
*/ 
exports.insert={
    insertUser:function insertData(database, email){
        //here data is simply a json document that has to be inserted, user data that is users' email address and the characters they have subscribed to are stored
        //here when we are inserting a user we assume that the user does not exist before hand

        //creating the document from layout given in userDocStructure
        var userDocStructure=jsonfile.readFileSync(userDocStructureFile)
        userDocStructure.email=email
        // console.log('userDocStructure:\n'+JSON.stringify(userDocStructure))
        database.collection(userCollection,function(err, collection){
            // console.log('userCollection inside insertUser:'+userCollection)
            if(err)
            {
                return console.log(console.red('error during collection instantiation in insert_user'))
            }
            collection.insert(userDocStructure, function(err, doc){
                console.log('userDocStructure inside insert:\n'+JSON.stringify(userDocStructure))
                if(err)
                {
                    console.log(chalk.red('could not enter into the user collection:')+err)
                }
            })
            console.log(chalk.green("user successfully written to database"))
        })
    
    },
    insertGSData:function insertData(database, data){
        //log for maintaining gossip girl character records

        //data here is a javascript object that simply stores the character related data

        var GSDocStructure=jsonfile.readFileSync(GSDocStructureFile)

        GSDocStructure.characterName=data.character_name
        GSDocStructure.location=data.location
        GSDocStructure.relationships=data.relationships
        GSDocStructure.job=data.job
        GSDocStructure.assignment=data.assignment

        database.collection(GSCollection,function(err, collection){
            if (err)
            {
                console.log(chalk.red('error during collection instantiation in insertGSData'))
            }
            collection.insert(GSDocStructure, function(err, doc){
                if(err)
                {
                    console.log(chalk.red('could not enter into the user collection:')+err)
                }
            })
            console.log(chalk.green("log successfully made"))
        })
    },
    insertCharacterSubscriptions: function insertData(database, email, data){
        //here we will append the subscriptions of a user.

        userDocStructure.email=email

        GSDocStructure.characterName=data.characterName
        GSDocStructure.location=data.location
        GSDocStructure.relationships=data.relationships
        GSDocStructure.job=data.job
        GSDocStructure.assignment=data.assignment

        var updateQuery={$push: { characters: GSDocStructure }}

        database.collection(userCollection, function(err, collection){
            if (err)
            {
                console.log(chalk.red('error during collection instantiation in insertCharacterSubscription'))
            }
            email={email:email}
            collection.update(email, updateQuery)
            console.log(chalk.green('successfully updated the user'))
        })
    },
    insertNotifications: function insertData(database, emails, data){
        var updateQuery={$push:{notifications:data}}
        database.collection(userCollection, function(err, collection){
            if(err){
                console.log(chalk.red('error during collection instantiation in insertNotifications'))
            }
            var i
            var emailQuery={$or:[]}
            for(i=0;i<emails.length;i++){
                var currentEmail=emails[i]
                emailQuery.$or.push({email:currentEmail})
            }
            collection.update(emailQuery, updateQuery)
            console.log(chalk.green('successfully updated the user notification'))
        })
    }

}

exports.read={
    userExists:function readData(database, email, callback){
        //returns if the user of that email exists
        var findQuery={email:email}
        database.collection(userCollection).find(findQuery, function(err, docs){
            if (err)
            {
                console.log(chalk.red('error in collection find')+err)
            }
            var count=0
            docs.each(function(err, doc){
                if(doc)
                {
                    count+=1
                }
                else
                {
                    console.log('count:'+count)
                    callback(null, count)
                }
            })
        })
    },
    checkUserSubscription: function readData(database, data, callback){
        //return the user email that have subscribed to this data, this data is coming from the capped collection

        var characterName=data.characterName
            if (data.location!=""){
                var location="true"
            }
            else{
                var location="false"
            }
            if(data.relationships!=""){
                var relationships="true"
            }
            else{
                var relationships="false"
            }
            if(data.job!=""){
                var job="true"
            }
            else{
                var job="false"
            }
            if(data.assignment!=""){
                var assignment="true"
            }
            else{
                var assignment="false"
            }

            var findQuery={characters: { $elemMatch:{ characterName:characterName, $or:[{$and:[{location:location}, {location:"true"}]} , {$and:[{relationships:relationships},{relationships:"true"}]},{$and:[{job:job},{job:"true"}]} ,{$and:[{assignment: assignment},{assignment:"true"}]}]  }}}

            // var findQuery={ characters: { $elemMatch:{ characterName:characterName } } }
            // findQuery.characters.$elemMatch.characterName=characterName

            var projection= { email: 1, _id: 0}

        database.collection(userCollection).find(findQuery, projection, function(err, docs){
            if(err)
            {
                console.log(chalk.red('error during reading of collection in checkUserSubs'))   
            }
            var documents=[]
            docs.each(function(err, doc){
                if(doc){
                    documents.push(doc.email)
                }
                else{
                    callback(null, documents)
                }
            })
            
        })
    },
    checkUserNotifications:function readData(database, email, callback){
        //reads notification data for only one email
        var findQuery={email:email}
        var projection={ notifications:1, _id:0 }
        database.collection(userCollection).find(findQuery, projection, function(err, docs){
            if(err){
                console.log(chalk.red('error during reading of collection in checkUserNotifications'))
            }
            var documents=[]
            docs.each(function(err, doc){
                if(doc){
                    documents.push(doc)
                }
                else{
                    console.log('document returned from userNotification:'+JSON.stringify(documents))
                    callback(null, documents[0].notifications)//since there will only be one document
                }
            })
        })
    }
}