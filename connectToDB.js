var path=require('path')
var jsonfile=require('jsonfile')
var file='config.json'

/*
reading of the config json file has to be a synchronous operation as the contents of the file are crucial to the correct working of the rest of the application
*/

var obj=jsonfile.readFileSync(file)
var host=obj.host
var port=obj.mongoDBPort
var databaseName=obj.databaseName
var GSCollection=obj.GSCollection


// import the language driver

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var ObjectID = require('mongodb').ObjectID

//construct url
var url = 'mongodb://'+host+':'+port+'/'+databaseName

MongoClient.connect(url, function(err, db){
    assert.equal(null, err)

    console.log('connected to mongoDB server!!!')

    return db.close()
})



