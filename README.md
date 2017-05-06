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

## Design and Architecture



