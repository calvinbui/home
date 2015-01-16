/**
 * Created by Calvin on 12/11/2014.
 */

// initialise app and extensions -> skycons and modals
var app = angular.module('myApp', ['ngAnimate','angular-skycons','ui.bootstrap']);

// Service Controller responsible for sections and items
app.controller("ServiceCtrl", function($scope, $http, $modal) {

    //Loading all the sections and items from the mongoose REST
    $scope.loadData = function () {
        $http.get('/section').then(function(response) {
            console.log("Loading Data");
            $scope.sections = response.data; //store data in scope
        });
    };

    //load dat data
    $scope.loadData();
    $scope.editing = false;

    // method used to open a modal. utilised regularly
    var openModal = function(template){
        $modal.open({
            templateUrl: template, //template is passed in
            controller: 'ServiceModalCtrl',
            size: 'sm', //small modal
            scope: $scope //take the scope with you
        });
    };

    // modal to edit item
    $scope.editItem = function(item) {
        $scope.item = angular.copy(item); // copy the selected item into scope
        openModal('/app/views/partials/modal-edit-item.html');
    };

    // when the edit item button is clicked
    $scope.editSection = function(section) {
        $scope.section = angular.copy(section); // copy the selected section into scope
        openModal('/app/views/partials/modal-edit-section.html');
    };

    // modal to add new item
    $scope.addItem = function(section) {
        $scope.item = undefined; // clear the scope
        $scope.section = angular.copy(section); // copy the selected section into scope
        openModal('/app/views/partials/modal-add-item.html');
    };

    // modal to add new section
    $scope.addSection = function() {
        $scope.section = undefined; // clear the scope
        openModal('/app/views/partials/modal-add-section.html');
    };

});

// Weather controller which displays weather
app.controller("WeatherCtrl", function($scope, $http, $modal) {
    // pull in the weather from the REST service at /weather
    $http.get('/weather').success(function (data) {
        $scope.weather = data; //store that weather in the scope
        // choose which icon to display
        $scope.currentweather = {
            forecast: {
                icon: $scope.weather.weatherIcon,
                iconSize: 50 // size
            }
        };
    });

    // when the weather is clicked
    $scope.openWeather = function(){
        $modal.open({
            templateUrl: '/app/views/partials/modal-weather.html',
            controller: 'ServiceModalCtrl', // don't know why its this but works lol
            size: 'lg', // large
            scope: $scope
        });
    };
});

// Controller that manages what happens after modals are finished
app.controller('ServiceModalCtrl', function ($scope, $http, $modalInstance) {

    // close modal
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }
    
    // aggregate all httpmethods that modals perform
    // refreshes data when finished
    $scope.httpMethod = function(method, url, parameter) {
        if (method == "put") { // updating
            $http.put(url, parameter).success(function() {
                $scope.loadData()
            });
        } else if (method == "post") { //creating
            $http.post(url, parameter).success(function() {
                $scope.loadData()
            });
        } else if (method == "delete") { //deleting
            $http.delete(url).success(function() {
                $scope.loadData()
            });
        }
        // close modal
        $scope.cancel();
    }
});

// http://plnkr.co/edit/GJwK7ldGa9LY90bMuOfl?p=preview
// Popup confirmation for ng-click
app.directive('confirmationNeeded', function () {
    return {
        priority: 1,
        terminal: true,
        link: function (scope, element, attr) {
            var msg = attr.confirmationNeeded || "Are you sure?";
            var clickAction = attr.ngClick;
            element.bind('click',function () {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
});