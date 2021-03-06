/* global ionic, define */
define([
  'app',
  'services/event',
  'controllers/app'
], function (app) {
  'use strict';

  app.controller('EventSettingsCtrl', [
    '$scope',
    '$stateParams',
    '$window',
    '$ionicPopup',
    'eventService',
    '$firebaseArray',
    '$firebaseAuth',
    '$state',
    function ($scope, $stateParams, $window, $ionicPopup, eventService, $firebaseArray, $firebaseAuth, $state) {
      var ref = firebase.database().ref();
      var userRef = ref.child("googleUsers");
      var users = $firebaseArray(userRef);
      var eventsRef = ref.child("events");
      var events = $firebaseArray(eventsRef);
      var db = firebase.database();

      $scope.events = $firebaseArray(ref.child('events'));
      $scope.users = $firebaseArray(userRef);

      var eventRef = firebase.database().ref('events/' + $stateParams.id);

      //get current user
      eventRef.on('value', function (snapshot) {
        console.log(snapshot.val());
        $scope.eventId = snapshot.val().eventId
      });




      firebase.auth().onAuthStateChanged(function (user) {
        var googleUser = gapi.auth2.getAuthInstance().currentUser.get();
        var userId = googleUser.getId();
        var userEventRef = ref.child("googleUsers/" + userId + "/events");
        var userEvents = $firebaseArray(userEventRef);
        $scope.userEvents = $firebaseArray(userEventRef);
        var profileRef = firebase.database().ref('googleUsers/' + userId);
        profileRef.on('value', function (snapshot) {
          $scope.admin = snapshot.val().admin
          $scope.owner = snapshot.val().owner
        });
      });







      $scope.sortEvents = function (event) {
        var date = - new Date(event.date);
        return date;
      };


      $scope.updateName = function (newName) {
        firebase.auth().onAuthStateChanged(function (user) {
          db.ref("events/" + $scope.eventId + "/name").set(newName);
        });
      }








      $scope.makeAdmin = function (id) {
        if ($scope.owner) {
          var popup = $ionicPopup.alert({
            title: 'Give Permission',
            template: 'Are you sure you want to give this user admin access?',
            buttons: [
              {
                text: '<b>OK</b>',
                onTap: function () {
                  db.ref("googleUsers/" + id + "/admin").set(true)
                }
              },
              {
                text: '<b>Cancel</b>',
                onTap: function () {

                  console.log('canceled');
                }
              }]
          });
        } else {
          console.log("Not permitted")
          $ionicPopup.alert({
            title: 'Access Denied',
            template: 'You need to be an Owner to do this.',
            buttons: [
              {
                text: '<b>OK</b>',
                onTap: function () {
                  console.log('shown');
                }
              }]
          });
        }

      }

      $scope.removeAdmin = function (id) {
        if ($scope.owner) {
          $ionicPopup.alert({
            title: 'Remove Admin Access',
            template: 'Are you sure you want to remove admin access?',
            buttons: [
              {
                text: '<b>OK</b>',
                onTap: function () {
                  db.ref("googleUsers/" + id + "/admin").set(false)
                }
              },
              {
                text: '<b>Cancel</b>',
                onTap: function () {

                  console.log('canceled');
                }
              }]
          });
        } else {
          console.log("Not permitted")
          $ionicPopup.alert({
            title: 'Access Denied',
            template: 'You need to be an Owner to do this.',
            buttons: [
              {
                text: '<b>OK</b>',
                onTap: function () {
                  console.log('shown');
                }
              }]
          });
        }


      }








    }
  ]);
});
