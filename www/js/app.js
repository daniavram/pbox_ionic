// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, Socket) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
//    Socket.connect('mqtt://broker.smartliving.io', 1883, 'daniavram:daniavram', 'tcndvrfznop', 'PdgYKiVwn3bErbb0HVQRk2');
    
    const client = mqtt.connect('https://broker.smartliving.io', {port: 1883, username: 'daniavram:daniavram', password: 'tcndvrfznop', clientId: 'PdgYKiVwn3bErbb0HVQRk2'});

    console.log(client);
    
    client
        .on('connect', function () {
            client.subscribe('client/daniavram/in/device/*/asset/100/state');
            console.log('Subscribed to MQTT client: ' + client.options.clientId);
        })
        .on('message', function(topic, message) {
            var boxId = topic.match(/.*?\/(\w+)\/asset\//);
            console.log(boxId);
        })
        .on('error', function(error) {
            console.log(error);
        })
        .on('reconnect', function () {
            console.log('reconnecting');
        })
        .on('close', function () {
            console.log('closed');
        })
        .on('offline', function () {
            console.log('client offline');
        });
    
//    var mqttClient = new MqttClient({
//        host: 'broker.smartliving.io',
//        port: 1883,
//        clientId: 'PdgYKiVwn3bErbb0HVQRk2',
//        username: 'daniavram:daniavram',
//        password: 'tcndvrfznop',
//        reconnect: 500,
//        timeout: 10
//    });
//    
//    mqttClient.connect();
//    
//    mqttClient
//        .on('connect', function() {
//            console.log('MQTT Client connected');
//        })
//        .on('connecting', function() {
//            console.log('Connecting to MQTT Broker');
//        })
//        .on('disconnect', function() {
//            console.log('oh noes! disconnected');
//        })
//        .on('offline', function() {
//            console.log('stopped trying, call connect manually');
//        })
//    ;

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.pickups', {
      url: '/pickups',
      views: {
        'menuContent': {
          templateUrl: 'templates/pickups.html',
          controller: 'PickupsCtrl'
        }
      }
    })
  
  .state('app.pickup', {
      url: '/pickups/:pickupId',
      views: {
          'menuContent': {
            templateUrl: 'templates/pickup.html',
            controller: 'PickupCtrl'
          }
      }
  })
  
  .state('app.boxes', {
      url: '/boxes',
      views: {
        'menuContent': {
          templateUrl: 'templates/boxes.html',
          controller: 'BoxesCtrl'
        }
      }
    })
  
  .state('app.box', {
      url: '/boxes/:boxId',
      views: {
          'menuContent': {
            templateUrl: 'templates/box.html',
            controller: 'BoxCtrl'
          }
      }
  })
  
  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/pickups');
})
;
