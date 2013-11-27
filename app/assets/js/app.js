/**
 * Created with JetBrains WebStorm.
 * User: Rob_Weaver
 * Date: 11/17/13
 * Time: 4:02 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var app = angular.module('promo', ['firebase']);


app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.
        when('/home',{
            templateUrl: 'app/views/home.html',
            controller: 'homeController',
            authRequired: false
        }).
        when('/new', {
            templateUrl: 'app/views/new.html',
            controller: 'newController'
        }).
        when('/contact',{
            templateUrl: 'app/views/contact.html',
            controller: 'contactController'
        }).
        when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'loginController'
        }).
        when('/upload', {
            templateUrl: 'app/views/upload.html',
            controller: 'uploadController',
            authRequired: true
        }).
        otherwise({
            redirectTo: '/home'
        });

}]);

app.controller('homeController', ['$scope','angularFire', function($scope, angularFire){

    // get the videos in storage for viewing on the home page
    var ref = new Firebase('https://the-weaver-project.firebaseio.com/videos');
    angularFire(ref, $scope, 'videos');


    /*
    $scope.videos = [
        {url: "http://www.youtube.com/embed/6NbAAmDuv_8?feature=player_detailpage"},
        {url: "//www.youtube.com/embed/Qe1LMf8rO94"},
        {url: "//www.youtube.com/embed/wk146eGRUtI"},
        {url: "//www.youtube.com/embed/ik9T88FYDXQ"}
    ]
    */
}]);
app.controller('fullController', ['$scope','angularFireAuth','angularFire', function($scope, angularFireAuth, angularFire){

    var ref = new Firebase('https://the-weaver-project.firebaseio.com/');
    var username;
/* Login Authentication */
    angularFireAuth.initialize(ref, {scope: $scope, name: 'user', path: "/home"});

        $scope.login = function(){
            angularFireAuth.login("facebook");
        }

        $scope.logout = function() {
            angularFireAuth.logout();
        }

    $scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
        console.log('Logged In: ' + user.name );
        username = user.name;
    });
    $scope.$on("angularFireAuth:logout", function(evt) {
        // User logged out.
        console.log('Logged Out');
        username = '';
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
        // There was an error during authentication.
        console.log('error' + err + ", " + evt);
    });



}]);

app.controller('loginController', ['$scope', function($scope){

}]);
app.controller('uploadController', ['$scope','angularFireCollection', function($scope, angularFireCollection){


    /* Video Upload */
    var ref = new Firebase('https://the-weaver-project.firebaseio.com/videos');
    $scope.videos = angularFireCollection(ref);
    //$scope.username = "Rob";
    $scope.addVideo = function(){
            $scope.videos.add({title: $scope.vidTitle, description: $scope.vidDesc, url: $scope.vidLink}, function(err){
                if(err){
                    //alert(err);
                    $scope.uploadSuccess = false;
                }else{
                    alert('Saved successfully')
                }
            });
        $scope.vidTitle = "";
        $scope.vidDesc = "";
        $scope.vidLink = "";
    }

}]);

