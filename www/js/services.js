angular.module('starter.services', ['ngResource'])

.factory('SailsAPI', function ($http) {
    var PICKUPS = "https://pbox-backend.herokuapp.com/pickup";
    var BOXES = "https://pbox-backend.herokuapp.com/box";
    
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

.factory('MqttFilter', function($rootScope) {
    
    var _filteredValues = {
        mqttLat : 0.0,
        mqttLng : 0.0,
        mqttTemperature : 0.0,
        mqttHumidity : 0.0,
        mqttLight : 0.0,
        mqttAcceleration : ""
    };
    
    return {
        filterMessage : function(message) {
            switch(message.Id) {
                case "wpfaY8YFhjDtHuhIac85c1vQ":
                    _filteredValues.mqttLat = message.Value.latitude;
                    _filteredValues.mqttLng = message.Value.longitude;
                    console.log('Latitude: ' + _filteredValues.mqttLat + ", Longitude: " + _filteredValues.mqttLng);
                    break;
                case "wyeJaLZqQ8sy2jcfyinCijGf":
                    _filteredValues.mqttTemperature = message.Value;
                    console.log('Temperature: ' + _filteredValues.mqttTemperature);
                    break;
                case "j5zTJqj90NAB4RqRV9r7XTxp":
                    _filteredValues.mqttHumidity = message.Value;
                    console.log('Humidity: ' + _filteredValues.mqttHumidity);
                    break;
                case "XlA9LN1heDcWbf8EONwIVZut":
                    _filteredValues.mqttLight = message.Value;
                    console.log('Light: ' + _filteredValues.mqttLight);
                    break;
                case "p47iq4uA0rfXeig8AErTdldh":
                    _filteredValues.mqttAcceleration = message.Value
                    console.log('Accelerometer: ' + _filteredValues.mqttAcceleration);
                    break;
            }
            $rootScope.$apply();
            $rootScope.$emit('mqtt-update', _filteredValues);
        },
        
        filteredValues: _filteredValues
    }
})

;