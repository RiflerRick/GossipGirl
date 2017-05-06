# GossipGirl
#### Startstruck


## Introduction
GossipGirl Startstuck is an application where you can register as a user and subscribe to your favourite characters from GossipGirl and you will be notified of changes in your character status in real time. An administrator of the database can make changes to the database and subsribed users can see those changes in real time as long as they are logged. Even if they are not logged in the data remains persistent will be stored for that user and the next time he logs in the data will be shown to the user.

## Choice of Language and Framework

As far as scalability and flexibility goes for any database, probably the best choice would be a nosql database. **MongoDB** was therefore my first choice in that regard and since I was using MongoDB I wanted to go for a **MEAN** design paradigm with regrad to choice of programming language and frameworks. I was alreay familiar with **NodeJS** as I had developed an web app with it **Share50** which was my **CS50** final project. For implementing the pubsub model for the app I used **socket.io** as it was pretty popular in the nodejs arena and a large amount of resource was available socket.io.

- Language: **Javascript** (client and server side)
- Engine: **NodeJS**
- Framwork: **Express**
- Database: **MongoDB**
- Pub-Sub model Library: **Socket.io**

## Architecture

![Design and architecture of GossipGirl Starstruck](https://raw.githubusercontent.com/RiflerRick/GossipGirl/master/assets/designGossipGirl.jpg)

The app is built on a simple client-server model on an MVC (model view controller) design paradigm. The entry point for the application is `app.js` in the root directory. The entire controller logic is distributed across 2 files:

- **`app.js`** - The entry point for express application.
- **`DbOps.js`** - The database handling including all CRUD operations.

### Database: Collections, Documents and Attributes

The database consists of 2 tables:
- **users**: For storing user data, the document structure was decided to be the following:
```
{
    "email":"NULL",
    "characters":[],
    "notifications":[]
}
```
The `characters` field would contain the data for the characters that the person has subscribed to. It is an array that would store all characters that the person had suscribed to. 

The `notifications` field would contain data with respect to the notification for a character that the person recieves. It is also an array.

The set of attributes for these fields would be the following:

**characters:**
-   ```
    {
        "characterName":<type: string>,
        "location":<type: boolean>,
        "relationships":<type: boolean>,
        "job":<type: boolean>,
        "assignment":<type: boolean>
    }
    ```
    For the user all we need to store is whether the user has subscribed to certain aspects of the character or not for example location, relationships and so on. Hence they are simply boolean values. 

**notifications:**
-   ```
    {
        "characterName":<type: string>,
        "location":<type: string>,
        "relationships":<type: string>,
        "job":<type: string>,
        "assignment":<type: string>
    }
    ```
    For the user notifications we need to store all the information about the character that the user has subscribed for and hence all the data that had been updated or logged by the system administrator will be stored here for persistence of notifications. So once the user has registered to the application he/she will never miss a notification whether he/she is offline or online.

- **GSCharacterLog:** As far as the character log goes, the system administrator will be able to update 

`DBOps.js` is custom module written specifically for handling all database operations other than the database connection which is done on `app.js` itself. There are two objects namely `read` and `insert` that are exported outside the module using the `exports` object of nodejs. This design descision was taken to separate database related code to another module for reasons of maintainability and writing cleaner code. The basic structure of the object is as follows:

```
exports.read={

    insertUser: function(<args>){
        //function for inserting a user to the user collection
    },
    insertGSData: function(<args>){

    },
    insertCharacterSubscriptions: function(<args>){
        
    },
    insertNotifications: function(<args>){

    }
}
```

