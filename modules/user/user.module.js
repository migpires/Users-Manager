(function () {
	'use strict';

	angular.module('user', ['ui.bootstrap'])
	.service('services', function () {

				return {
            getUserByID: function (users, id) {
							//Get User from object by id
								var lookup = {};
								for (var i = 0, len = users.length; i < len; i++) {
										lookup[users[i].id] = users[i];
								}

								return lookup[id];
            }
        };


		})
	.controller('UsersCtrl', function ($scope, $rootScope, filterFilter, $http, $uibModal, services) {

	    $rootScope.usersList = [];
			$scope.currentPage = 1;
  		$scope.numPerPage = 10;
  		$scope.maxSize = 5;

			console.log($rootScope.savedUsers);
			if($rootScope.savedUsers == undefined || $rootScope.savedUsers.length <= 0) {

					//Load Users
			    $http({
			      method: 'GET',
			      url: 'data/users.json'
			    })
			    .success(function (data, status, headers, config) {
			      $rootScope.usersList = data;
						console.log($rootScope.usersList);

						//Pagination
					  $scope.$watch('currentPage + numPerPage', function() {
					    $scope.pagination();
					  });

			    })
			    .error(function (data, status, headers, config) {
				    console.log('something went wrong :(');
			    });

			} else {
				$rootScope.usersList = $rootScope.savedUsers;
				//Pagination
				$scope.$watch('currentPage + numPerPage', function() {
					$scope.pagination();
				});
			}

			//Checkbox Select

			// Selected users
		  $scope.selection = [];

		  // Helper method to get selected users
		  $scope.selectedUsers = function selectedUsers() {
		    return filterFilter($rootScope.usersList, { selected: true });
		  };

		  // Watch users for changes
		  $scope.$watch('usersList|filter:{selected:true}', function (nv) {
				console.log($scope.selection);
		    $scope.selection = nv.map(function (user) {
		      return user;
		    });
		  }, true);

			// Delete Users
			$scope.delete = function (user) {
					$rootScope.usersList.splice($rootScope.usersList.indexOf(user),1);
					$scope.pagination();
			}

			$scope.deleteUsers = function () {

					var arr = $scope.selection;
					console.log(arr);
					for (var i = 0, len = arr.length; i < len; i++) {
					  $rootScope.usersList.splice($rootScope.usersList.indexOf(arr[i]),1);
					}
					$scope.pagination();

			}

			$scope.downloadUsers = function () {}

			// Filter Users per Page
			$scope.pagination = function () {
					var begin = (($scope.currentPage - 1) * $scope.numPerPage)
			    , end = begin + $scope.numPerPage;

			    $scope.filteredUsers = $rootScope.usersList.slice(begin, end);
			}

			//Modal
			$scope.show = function (id) {

				//Get User from object by id
				var user = services.getUserByID($rootScope.usersList, id);

				//Calculate Birth Date
				var birthDate = new Date(user.dateOfBirth);
				var ageDifMs = Date.now() - birthDate.getTime();
		    var ageDate = new Date(ageDifMs); // miliseconds from epoch
		    var age = Math.abs(ageDate.getUTCFullYear() - 1970);

		    $uibModal.open({
		      ariaLabelledBy: 'modal-title-bottom',
		      ariaDescribedBy: 'modal-body-bottom',
		      templateUrl: 'modal.html',
					controller: 'ModalCtrl',
					resolve: {
		        user: function () {
							console.log(user);
		          return user;
		        },
						age: function () {
							console.log(age);
		          return age;
		        }
		      }
		    });
		  };

	})
	.controller('ModalCtrl', function($scope, $uibModalInstance, user, age) {
		$scope.user = user;
		$scope.age = age;

		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
	})
	.controller('editUserCtrl', function($scope, $rootScope, $state, $stateParams, $uibModal, $location, services) {
		$rootScope.savedUsers = [];
		$scope.user = services.getUserByID($rootScope.usersList, $stateParams.id);
		$scope.original = angular.copy(services.getUserByID($rootScope.usersList, $stateParams.id));
		console.log($scope.usersList[$stateParams.id]);

		//Save User
		$scope.save = function() {
			for (var i = 0, len = $rootScope.usersList.length; i < len; i++)
					if($rootScope.usersList[i].id === $scope.user.id)
							$rootScope.usersList[i] = angular.copy($scope.user);

			
			$rootScope.savedUsers = angular.copy($rootScope.usersList);
			$scope.original = angular.copy($scope.user);
			console.log($rootScope.usersList);
		};

		//Modal
		$scope.cancel = function () {

			//Compare objects to check if theres any changes
			if(angular.equals($scope.user, $scope.original) !== true)
				$uibModal.open({
					ariaLabelledBy: 'modal-title-bottom',
					ariaDescribedBy: 'modal-body-bottom',
					templateUrl: 'modal.html',
					controller: 'EditModalCtrl',
				});
				else
					$location.path('/');
		};
  })
	.controller('EditModalCtrl', function($scope, $uibModalInstance) {
		$scope.close = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});




}());
