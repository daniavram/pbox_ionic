var localBoxes = [
        {
            boxId: "PdgYKiVwn3bErbb0HVQRk2Ea",
            gpsAssetId: "7w0RPFgxTMfB1HsXxaSPS86R",
            temperatureAssetId: "wyeJaLZqQ8sy2jcfyinCijGf",
            humidityAssetId: "j5zTJqj90NAB4RqRV9r7XTxp",
            lightAssetId: "XlA9LN1heDcWbf8EONwIVZut",
            accelerometerAssetId: "p47iq4uA0rfXeig8AErTdldh",
            isBeingDelivered: false
        },
        {
            boxId: "8765432",
            gpsAssetId: "12345gxTMfB1HsXxaSPS86R",
            temperatureAssetId: "12345LZqQ8sy2jcfyinCijGf",
            humidityAssetId: "12345j90NAB4RqRV9r7XTxp",
            lightAssetId: "12345N1heDcWbf8EONwIVZut",
            accelerometerAssetId: "123454uA0rfXeig8AErTdldh",
            isBeingDelivered: false
        }
    ];

var localPickups = [
        {
            pickupLatitude: 123.123,
            pickupLongitude: 321.321,
            packageSize: "Small",
            destinationLatitude: 77.7,
            destinationLongitude: 67.8,
            id: "123"
        },
        {
            pickupLatitude: 321.321,
            pickupLongitude: 456.456,
            packageSize: "Large",
            destinationLatitude: 879.7,
            destinationLongitude: 98.7,
            id: "5678"
        }
    ];

angular.module('starter.controllers', ['starter.services', 'ionic', 'google.places'])


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PickupsCtrl', function($scope, $ionicModal, Pickup, $cordovaGeolocation) {
//    $scope.pickups = Pickup.query();
    $scope.pickups = localPickups;
    var geocoder = new google.maps.Geocoder;
    var geocoderOptions = {timeout: 10000, enableHighAccuracy: true, language: 'en'};
                
    $scope.openAddPickupModal = function() {
        $ionicModal.fromTemplateUrl('templates/addPickupModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function(modal) {
            $scope.addPickupModal = modal;
            $scope.pickupData = {
                pickupAddress: null,
                pickupAddressLatitude: null,
                pickupAddressLongitude: null,
                pickupDestination: null,
                pickupDestinationLatitude: null,
                pickupDestinationLongitude: null,
                boxSize: null
            };
            modal.show();
        });
    };
	
    $scope.closeAddPickupModal = function() {
        $scope.addPickupModal.remove();
    };
	
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.addPickupModal.remove();
    });
    
    //$scope should not be needed. must be removed. but how?
    $scope.geocodeCallback = function() {
        
        if (
            $scope.pickupData.pickupAddressLatitude &&
            $scope.pickupData.pickupAddressLongitude &&
            $scope.pickupData.pickupDestinationLatitude && 
            $scope.pickupData.pickupDestinationLongitude && 
            $scope.pickupData.boxSize
           )
        {
            var someRandomNr = Math.floor((Math.random() * 100) + 1);
            var randomPickupId = "some_random_number_here_" + someRandomNr;
            localPickups.push(
                {
                    pickupLatitude: $scope.pickupData.pickupAddressLatitude,
                    pickupLongitude: $scope.pickupData.pickupAddressLongitude,
                    packageSize: $scope.pickupData.boxSize,
                    destinationLatitude: $scope.pickupData.pickupDestinationLatitude,
                    destinationLongitude: $scope.pickupData.pickupDestinationLongitude,
                    id: randomPickupId
                });
            $scope.addPickupModal.remove();
        }
    };
    
    $scope.addPickup = function(geocodeCallback) {
        
        if ($scope.pickupData.pickupAddress) {
            geocoder.geocode({'address': $scope.pickupData.pickupAddress.formatted_address}, function (results, status) {
                 if (status == 'OK') {
                     var formattedAddress = results[0].geometry.location.toJSON();
                     $scope.pickupData.pickupAddressLatitude = formattedAddress.lat;
                     $scope.pickupData.pickupAddressLongitude = formattedAddress.lng;
                     $scope.geocodeCallback();
                 } else {
                     console.log('Geocoding the Pickup address was not successful for the following reason: ' + status);
                 }
            });
        }
        
        if ($scope.pickupData.pickupDestination) {
            geocoder.geocode({'address': $scope.pickupData.pickupDestination.formatted_address}, function (results, status) {
                 if (status == 'OK') {
                     var formattedAddress = results[0].geometry.location.toJSON();
                     $scope.pickupData.pickupDestinationLatitude = formattedAddress.lat;
                     $scope.pickupData.pickupDestinationLongitude = formattedAddress.lng;
                     $scope.geocodeCallback();
                 } else {
                     console.log('Geocoding the Destination address was not successful for the following reason: ' + status);
                 }
            });
        }
        
    };
    
    $scope.putCurrentLocationInPickup = function() {
        $cordovaGeolocation.getCurrentPosition(geocoderOptions).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);            
            geocoder.geocode({'location': latLng.toJSON()}, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        $scope.pickupData.pickupAddress = results[1].formatted_address;
                    } else {
                        $scope.pickupData.pickupAddress = null;
                        console.log('No results found');
                    }
                } else {
                    $scope.pickupData.pickupAddress = null;
                    console.log('Geocoder failed due to: ' + status);
                }

                $scope.$apply();
            });
            
            $scope.pickupData.pickupAddressLatitude = position.coords.latitude;
            $scope.pickupData.pickupAddressLongitude = position.coords.longitude;
        }, function(error) {
            console.log("Could not get location");
            $scope.pickupData.pickupAddress = null;
        });
        
    };
    
    $scope.putCurrentLocationInDestination = function() {
        $cordovaGeolocation.getCurrentPosition(geocoderOptions).then(function(position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);            
            geocoder.geocode({'location': latLng.toJSON()}, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        $scope.pickupData.pickupDestination = results[1].formatted_address;
                    } else {
                        $scope.pickupData.pickupDestination = null;
                        console.log('No results found');
                    }
                } else {
                    $scope.pickupData.pickupDestination = null;
                    console.log('Geocoder failed due to: ' + status);
                }

                $scope.$apply();
            });
            
            $scope.pickupData.pickupDestinationLatitude = position.coords.latitude;
            $scope.pickupData.pickupDestinationLongitude = position.coords.longitude;
        }, function(error) {
            console.log("Could not get location");
            $scope.pickupData.pickupDestination = null;
        });
    };
    
})

.controller('PickupCtrl', function($scope, $stateParams, Pickup) {
//    $scope.pickup = Pickup.get({id: $stateParams.pickupId});
    $scope.pickup = localPickups.find(function(param) {
        if (param.id == $stateParams.pickupId) {
            return param;
        }
    });
})

.controller('BoxesCtrl', function($scope, $ionicModal, Box) {
//    $scope.boxes = Box.query();
    $scope.boxes = localBoxes;
    
    
    $scope.openAddBoxModal = function() {
        $ionicModal.fromTemplateUrl('templates/addBoxModal.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function(modal) {
            $scope.addBoxModal = modal;
            modal.show();
        });
    };
	
    $scope.closeAddBoxModal = function() {
        $scope.addBoxModal.remove();
    };
	
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.addBoxModal.remove();
    });
    
    $scope.addBox = function(boxParam) {
        if (boxParam.boxIdParam &&
            boxParam.gpsAssetId &&
            boxParam.tempAssetId &&
            boxParam.humidAssetId &&
            boxParam.lightAssetId &&
            boxParam.accelAssetId
           ) 
        {
            localBoxes.push({
                boxId: boxParam.boxIdParam,
                gpsAssetId: boxParam.gpsAssetId,
                temperatureAssetId: boxParam.tempAssetId,
                humidityAssetId: boxParam.humidAssetId,
                lightAssetId: boxParam.lightAssetId,
                accelerometerAssetId: boxParam.accelAssetId,
                isBeingDelivered: false
            });
            
            $scope.addBoxModal.remove();
        } else {
            console.log('Box not created. Not all fields are filled in');
        }
    };
    
})

.controller('BoxCtrl', function($scope, $stateParams, Box, $cordovaGeolocation) {
//    $scope.box = Box.get({boxId: $stateParams.boxId});
    $scope.box = localBoxes.find(function(param) {
        if (param.boxId == $stateParams.boxId) {
            return param;
        }
    });
    
    var latFromMqtt = 46.190999;
    var longFromMqtt = 21.300707;
    var options = {timeout: 10000, enableHighAccuracy: true};
    var latLng = new google.maps.LatLng(latFromMqtt, longFromMqtt);

    var mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
    });
    
    
})

;