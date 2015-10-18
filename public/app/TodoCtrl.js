'use strict';
angular
  .module('FileSync')
  .controller('TodoCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.list = {};

    function onTodoUpdated(todoList) {
      this.list = todoList;
      $scope.$apply();
    }

    SocketIOService.onTodoUpdated(onTodoUpdated.bind(this));
  }]);
