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

The database consists of 2 collections:
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

- **GSCharacterLog:** As far as the character log goes, the system administrator will be able to update changes to the database in this collection. The set of attributes for this collection is as follows:

```
{
    "characterName":<type: string>,
    "location":<type: string>,
    "relationships":<type: string>,
    "job":<type: string>,
    "assignment":<type: string>
}
```
### Database Integration

`DBOps.js` is a custom module written specifically for handling all database operations other than the database connection which is done on `app.js` itself. There are two objects namely `read` and `insert` that are exported outside the module using the `exports` object of nodejs. This design descision was taken to separate database related code to another module for reasons of maintainability and writing cleaner code. The basic structure of the object is as follows:

```
exports.insert={

    insertUser: function(<args>){
        //function for inserting a user to the user collection
    },
    insertGSData: function(<args>){
        //function for inserting logs for gossip girl character status(handled by the sysadmin) 
    },
    insertCharacterSubscriptions: function(<args>){
        //function for inserting character subscriptions for users
    },
    insertNotifications: function(<args>){
        //function for inserting notification data in the users collection
    }
}
exports.read={
    userExists: function(<args>){
        //function to check whether the user exists
    },
    checkUserSubscription: function(<args>){
        //function to check which are the characters and the character data that a particular user has subscribed to.
    },
    checkUserNotifications: function(<args>){
        //function to read the notifications of the user.
    }
}
```
The database was integrated using a nodejs module called `mongodb`. This module provides us with callback functions for easily connecting with the mongoDB database and communicating with it on the default port. All insertions, updations and reading of the collections was done using the mongodb module methods.

### Web Framework: Express

Express was used as the framework for designing the web application. The directory structure used is the deafult directory structure suggested and used by Express. The root directory has three main directories namely **public, views and node_modules**. 

-   public: It contains all static files including the css and js files of the entire application.
-   views: It contains all the views or templates to render to the browser.
-   node_modules: It contains all the node modules used in the application.

`package.json`- For any express or more generally node application all the dependencies of the application and other metadata for the application are stored in the file `package.json`. When cloning a root directory of any node application and running `npm install`, we can download all the modules or packages used for the application into node_modules. 

### Triggers in MongoDB

For the purposes of the application a trigger was necessary in the database that would trigger an event telling the server or any other event listener that a new document had been inserted. This was achieved in MongoDB using `capped collections` and `tailable cursors`. 

A capped collection in MongoDB as the name suggests is simply a collection that has a higher limit in the storage of documents. 

A tailable cursor is simply a type of cursor that iterates though all documents returned by a query until it finds the last document. The special thing about a tailable cursor is that it can be set to listen for new documents being inserted into the collection. There are options that can be set in the function that returns the cursor in order to do the same.

Whenever a new document would arrive the tailable cursor would fire an event and any process listening for that event would be able to hear it and take necessary action.

### Socket.io integration

Socket.io is a popular library that is used for the purpose of real time applications especially in chat servers. It uses the technology of **web sockets** in modern browsers and also fall back to **long-polling** in case the browser does not support web sockets. 

This project required a real time service for showing notifications to the user in real time for changes in a database. 

Two socket connection were used to achieve this:

- A connection between the `server` and the application listening to the `tailable cursor`.

- A connection between the `server` and the `clients` of the application. 

Whenever the tailable cursor fired an event suggesting a new document had arrived the socket would send this new document data to the server, the server would run a query in the mongoDB database checking which users had subscribed to the data in this new document.

The application for opening the tailable cursor as a separate process is `openTailableCursor.js`.

### Templating Engine: EJS(Embedded Javascript)

A simple templating engine popularly with express that can help with variable interpolation at various places inside the web application

### FrontEnd Library: Materialize

Materialize is a material design library(mdl) used for creating `material` like design and integrating with html5.

### Difficulties faced:

- **MongoDB**: This was my first experience with regard to designing an application with the database as MongoDB and nosql in general. I had to refer to ample number of documentations and other resources to figure out how to effectively and efficiently communicate with the database. 
- **Persistence of connection with MongoDB**: The NodeJS driver for mongoDB has callback functions for connecting to the database which suggested that I could not return any values from the function. However this would also mean that in order to maintain a persistent connection with the database I would have to do all CRUD opearations inside this connect function which was simply impossible with my application needs. Therefore I designated a separate global variable as the database instance to maintain a persistent connection with the database for subsequent CRUD operations after connecting to the database.
- **Using Socket.io and sending message to specific clients**: This assignment was also my first attempt at using socket.io for implementing a pub-sub model. Most online resources including the documentation of socket.io suggested how to send messages to all clients connected to the network. However my requirement was essentially to tag specific users so that I can recognise and send data to specific users of my choice since all the users would essentially be listening to the same `event` for messages. To resolve this I used `rooms` of socket.io. I assigned each user to a specific `room` given by their email addresses and during the sending of messages now it would be easy to send the message given the specific room that the user belonged.
- **Serializing async code**: In case of asynchronous programming in general serializing async code can be a challenge and I serialized my code using a popular nodejs library called `async`. It has many inbuilt functions that can tackle this very problem of writing serialized versions of code in an async environment.

### Application Usage from the Client side:

Users can log in into their accounts subscribe to characters of Gossip Girl of their choice. As and when the administrator logs changes to the database, the user would be notified on his/her home page about the change in real time. The notification to the user would remain persistent and the user would be able to see them even at the next login.

### Setting up the application:

#### Requirements:

- **NodeJS**: Nodejs must be installed in the system. click [here](https://nodejs.org/en/download/) to download.

- **MongoDB**: The application uses MongoDB as its database and it must be preinstalled in the system. click [here](https://www.mongodb.com/download-center?jmp=homepage#community) to download.

#### Steps to run the application:

- Start the mongoDB server after installing it. Click [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-the-mongodb-service) to see how to start the mongoDB server.

- Run `npm install`: In order to install all the dependencies of the application you would have to run `npm install` on terminal (for Linux users) or command prompt (for Windows users) in the root directory of the application. This may take some time. All modules required for the application will be downloaded and placed in the `node_modules` directory.

- Run `app.js`: Go to the root directory of the GossipGirl Starstruck and type on your terminal (for Linux users) or command prompt (for Windows users) `node app.js`.

- Run `openTailableCursor.js`: Open a new terminal (for Linux users) or command prompt (for Windows users) and type `node openTailableCursor.js`.

- The server should be running on port `localhost:4000`. Go to the browser and open `http://localhost:4000`. 

### References:

- **Capped collection and Tailable cursors**: Obtained from [http://tugdualgrall.blogspot.in/2015/01/how-to-create-pubsub-application-with.html](http://tugdualgrall.blogspot.in/2015/01/how-to-create-pubsub-application-with.html).

- **MongoDB integration**: [https://www.youtube.com/watch?v=W-WihPoEbR4](https://www.youtube.com/watch?v=W-WihPoEbR4) and the mongoDB official documentation, [https://docs.mongodb.com/manual/crud/](https://docs.mongodb.com/manual/crud/).

- **Socket.io**: Socket.io official documentation server side [https://socket.io/docs/server-api/](https://socket.io/docs/server-api/) and client side [https://socket.io/docs/client-api/](https://socket.io/docs/client-api/).

- **Express and nodeJS**: [https://www.youtube.com/watch?v=3S9ELJS1aU8](https://www.youtube.com/watch?v=3S9ELJS1aU8) and [https://www.youtube.com/watch?v=ZVXQVJxD4c0](https://www.youtube.com/watch?v=ZVXQVJxD4c0) as well as official documentation on these [https://nodejs.org/dist/latest-v7.x/docs/api/](https://nodejs.org/dist/latest-v7.x/docs/api/).

- **NodeJS async library**: [http://caolan.github.io/async/](http://caolan.github.io/async/) especially for serializing asynchronous code.

- **Materialize for front end design**: [http://materializecss.com/getting-started.html](http://materializecss.com/getting-started.html)