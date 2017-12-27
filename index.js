var app = require('express')();

var http = require('http').Server(app);

var io = require('socket.io')(http); // Init new socket.io instance by passing the http(the HTTP server) object.


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/styles.css', function(req, res) {
    res.sendFile(__dirname + '/css/styles.css');
})


app.get('/js/world.js', function(req, res) {
    res.sendFile(__dirname + '/js/world.js');
})

app.get('/js/app.js', function(req, res) {
    res.sendFile(__dirname + '/js/app.js');
})

app.get('/js/data.js', function(req, res) {
    res.sendFile(__dirname + '/js/data.js');
})

app.get('/js/lib/threex.keyboardstate.js', function(req, res) {
    res.sendFile(__dirname + '/js/lib/threex.keyboardstate.js');
})

app.get('/js/lib/three.js', function(req, res) {
    res.sendFile(__dirname + '/js/lib/three.js');
})

app.get('/images/grasslight-big.jpg', function(req, res) {
    res.sendFile(__dirname + '/images/grasslight-big.jpg');
})

app.get('/js/lib/OrbitControls.js', function(req, res) {
    res.sendFile(__dirname + '/js/lib/OrbitControls.js');
})



var USERS = [];

var allClients = [];

var ALL_MESSAGES = [];


io.on('connection', function(socket) {
    console.log('A user is connected');
    ALL_MESSAGES.push({ "name": msg[0], "message": msg[1] });

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg); // emit the event from the server to the rest of the users
    });


    socket.on('new', function(user) {
        console.log("Added another user : " + user.name);
        USERS.push(user);
        allClients.push({ "client_id": user.idNum, "sock_id": socket.id });
        socket.emit('archived', ALL_MESSAGES);
    });
    // After sending the user ID, the frontend has created a User object
    // Receive full 'profile' of new user
    socket.on('user info', function(user) {

        for (i = 0; i < USERS.length; i++) {
            if (USERS[i].name == user.name) {
                USERS[i] = user;
            }
        }

        // All users connected thus far sent to client
        // Each time a user logs in, all users get an updated list
        io.emit('all users', USERS);
    });


    // Update other users' canvas when user disconnects
    socket.on('disconnect', function() {
        console.log('A user disconnected');
        var deleteUserID;
        for (i = 0; i < allClients.length; i++) {
            if (allClients[i].sock_id === socket.id) {
                deleteUserID = allClients[i].client_id;
                io.emit('avatar disconnection', allClients[i].client_id);
            }
        }

        for (i = 0; i < USERS.length; i++) {
            if (USERS[i].idNum === deleteUserID) {
                USERS.splice(i, 1);
                io.emit('all users', USERS);
            }
        }

    });

});

// Make http server listen on port 3000.
var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log("listening on *:3000");
});