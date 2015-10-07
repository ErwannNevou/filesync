'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.messages = [];
    this.message;

    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }

    function onMessageUpdated(messagess) {
      this.messages = messagess;
      $scope.$apply();
    }

    this.sendMessage = function(){
    	SocketIOService.messageUpdate(this.message);
    }

    SocketIOService.onMessageUpdated(onMessageUpdated.bind(this));

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
  }]);
