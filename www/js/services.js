angular.module('starter.services', ['ngResource'])

.factory('SailsAPI', function ($http) {
    var PICKUPS = "http://localhost:1337/pickup";
    var BOXES = "http://localhost:1337/box";
    
    return {
        getPickups: function() {
            return $http.get(PICKUPS);
        },
        getBoxes: function() {
            return $http.get(BOXES);
        },
        getPickupById: function(id) {
            return $http.get(PICKUPS + "/" + id);
        },
        getBoxById: function(id) {
            return $http.get(BOXES + "/" + id);
        },
        postPickup: function(json) {
            return $http.post(PICKUPS, json);
        },
        removePickup: function(id) {
            return $http.delete(PICKUPS + "/" + id);
        },
        postBox: function(json) {
            return $http.post(BOXES, json);
        },
        removeBox: function(id) {
            return $http.delete(BOXES + "/" + id);
        },
        attachBoxToPickup: function(pickupId, boxId) {
            return $http.put(PICKUPS + "/" + pickupId + "/" + boxId, null);
        },
        removeBoxFromPickup: function(pickupId, boxId) {
            return $http.delete(PICKUPS + "/" + pickupId + "/" + boxId);
        }
    }
})

.factory('Socket', function($rootScope) {

    var service = {};
    var client = {};

    service.connect = function(host, port, user, password, client) {
        var options = {
          username: user,
          password: password,
          clientId: client
        };
        console.log("Try to connect to MQTT Broker " + host + " with user " + user);
        client = mqtt.createClient(parseInt(port),host,options);
        console.log(client);
        client.subscribe('client/daniavram/in/device/*/asset/100/state'); 

        client.on('connect', function(connectionParam) {
            console.log('connected');
        });
        
        client.on('error', function(err) {
            console.log('error!', err);
            client.stream.end();
        });

        client.on('message', function (topic, message) {
          //service.callback(topic,message);
            console.log('oh, look; a message!');
//            var boxId = topic.match(/.*?\/(\w+)\/asset\//);
//            if (boxId != null) {
//                boxController.boxButtonPressed(boxId[1]);
//            }
        });
    }

    service.publish = function(topic, payload) {
        client.publish(topic,payload, {retain: true});
        console.log('publish-Event sent '+ payload + ' with topic: ' + topic + ' ' + client);
    }

    service.onMessage = function(callback) {
        console.log('some message');
        service.callback = callback;
    }

    return service;
})

;