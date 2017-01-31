(function () {
	'use strict';

	angular.module('app', [
		'ui.router',
		'user',
		'ui.bootstrap',
		'ngSanitize',
		'ngCsv'
	]).config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('user', {
      url: "/",
      templateUrl: "modules/user/user.list.html"
    })
    .state('userDetails', {
      url: "/user/:id",
      templateUrl: "modules/user/user.edit.html"
    })
});

}());
