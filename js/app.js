$(function() {

    var keyboard = new THREEx.KeyboardState();

    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth / 2;


    var scene = new THREE.Scene();

    // Camera setup 
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    // var controls = new THREE.OrbitControls(camera);
    camera.position.set(0, 150, 400);

    camera.lookAt(scene.position);


    // Avatar speed (step size)
    var dx = 10;
    var dz = 10;

    var allUsers;


    var socket = io();


    var userName = prompt("What is your name?");

    // Assign user client id to associate with socket id
    var userID = getRandomString();

    function getRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }


    // Instantiate User
    var user = new User(userName, userID, 0, 0, 0);

    // Send back to server new user's full 'profile' i.e. name etc.
    socket.emit('new', user);


    // Get information of other connected users
    socket.on('all users', function(all) {
        var tmp_list = [];
        for (i = 0; i < all.length; i++) {
            var tmp_usr = new User(all[i].name, all[i].idNum, all[i].x, all[i].y, all[i].z);
            tmp_list.push(tmp_usr);
        }

        // Update allUsers
        allUsers = tmp_list;


        // Instantiate other connected users
        if (allUsers) {
            for (i = 0; i < allUsers.length; i++) {
                octopus.removeAvatar(allUsers[i].idNum);
                if (allUsers[i].name != user.name) {


                    allUsers[i].createOthersAvatar();
                    var otherSphere = allUsers[i].othersAvatar;
                    otherSphere.name = allUsers[i].idNum;
                    otherSphere.position.set(allUsers[i].x, allUsers[i].y, allUsers[i].z);
                    scene.add(otherSphere);
                }
            }
        }

    });


    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    var canvas = document.querySelector("#c");
    canvas.appendChild(renderer.domElement);

    user.createAvatar();
    var sphere = user.sphereAvatar;

    sphere.position.set(10, 0, 0);
    scene.add(sphere);


    var axes = new THREE.AxesHelper(100);
    scene.add(axes);

    var w = new World();

    var floor = w.floor();
    floor.position.y = -10;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);


    // Chat Board
    // When user types messsage, the server gets it as a chat message event
    $('form').submit(function() {
        socket.emit('chat message', [user.name, $('#m').val()]);
        $('#m').val(''); // Reset message element
        return false;
    });

    // On client side when we capture chat message event, we'll include it in the page
    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').text(msg[0] + " : " + msg[1]));
    });


    socket.on('avatar disconnection', function(id) {
        octopus.removeAvatar(id);
    });



    var octopus = {
        init: function() {
            view.render();
        },

        keyDown: function(event) {
            switch (event.keyCode) {
                case 38:
                    /* up arrow  */
                    if (sphere.position.z + dz > -350) {
                        sphere.position.z -= dz;
                        user.setZ(user.z - dz);
                        socket.emit('user info', user);
                        camera.position.set(user.x, 150, 400 + user.z);

                    }
                    break;
                case 40:
                    /* down arrow */
                    if (sphere.position.z - dz < 350) {
                        sphere.position.z += dz;
                        user.setZ(user.z + dz);
                        socket.emit('user info', user);
                        camera.position.set(user.x, 150, 400 + user.z);
                    }
                    break;
                case 37:
                    /* left arrow */
                    if (sphere.position.x - dx > (-WIDTH / 2)) {
                        sphere.position.x -= dx;
                        user.setX(user.x - dx);
                        socket.emit('user info', user);
                        camera.position.set(user.x, 150, 400 + user.z);

                    }
                    break;
                case 39:
                    /* right arrow */
                    if (sphere.position.x + dx < (WIDTH / 2)) {
                        sphere.position.x += dx;
                        user.setX(user.x + dx);
                        socket.emit('user info', user);
                        camera.position.set(user.x, 150, 400 + user.z);
                    }
                    break;
            }
        },

        animate: function() {
            requestAnimationFrame(octopus.animate);
            //controls.update();
            renderer.render(scene, camera);
        },

        removeAvatar: function(a) {
            var delAvatar = scene.getObjectByName(a);
            scene.remove(delAvatar);

        }
    };


    var view = {

        render: function() {
            window.addEventListener('keydown', octopus.keyDown, true);
            octopus.animate();
        }
    };


    octopus.init();

});