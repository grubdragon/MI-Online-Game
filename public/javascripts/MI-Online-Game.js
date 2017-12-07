var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','facebook']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html'
	})
	.when('/leaderboard', {
		templateUrl: 'partials/leaderboard.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

/* Facebook */
app.config(function(FacebookProvider) {
	FacebookProvider.init('364525113975028');
})

app.controller('facebookCtrl',['$rootScope','Facebook', function ($rootScope, Facebook) {
	$rootScope.loginStatus = 'disconnected';
	$rootScope.facebookIsReady = false;
	$rootScope.user = {};
	$rootScope.login = function () {
		Facebook.login(function(response) {
			$rootScope.loginStatus = response.status;
		});
	};
	$rootScope.removeAuth = function () {
		Facebook.api({
			method: 'Auth.revokeAuthorization'
		}, function(response) {
			Facebook.getLoginStatus(function(response) {
				$rootScope.loginStatus = response.status;
			});
		});
	};
	$rootScope.api = function () {
		Facebook.api('/me', function(response) {
			$rootScope.user = response;
		});
	};
	
	$rootScope.$watch(
		function() {
			return Facebook.isReady();
		},
		function(newVal) {
			if (newVal)
				$rootScope.facebookReady = true;
		}
		);

	var userIsConnected = false;

	Facebook.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			userIsConnected = true;
		}
	});

      /**
       * IntentLogin
       */
       $rootScope.IntentLogin = function() {
       	if(!userIsConnected) {
       		$rootScope.login();
       	}
       };

      /**
       * Login
       */
       $rootScope.login = function() {
       	Facebook.login(function(response) {
       		if (response.status == 'connected') {
       			$rootScope.logged = true;
       			$rootScope.me();
       		}

       	});
       };

       $rootScope.logout = function() {
       	Facebook.logout(function() {
       		$rootScope.$apply(function() {
       			$rootScope.user   = {};
       			$rootScope.logged = false;  
       		});
       	});
       }




   }]);


// ***** -> uncomment and define the controller function here

app.controller('leaderboardCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Leaderboard = function(){
		var user = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};

		$http.post('/api/leaderboard', user, config);

	}


}]);

app.controller('answerCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Answer = function(){
		var answer = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid,
			"level" : $rootScope.user.level,
			"ans" : $rootScope.user.ans
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};
		$http.post('/submit/:level', ans, config)

	}

	}]);

app.controller('questionCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){
	$rootScope.Question = function(){
		var user = $.param({
			"firstName" : $rootScope.user.firstName,
			"lastName" : $rootScope.user.lastName,
			"fbid" : $rootScope.user.fbid
		});
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};

		$http.post('/:levelReq', user, config);

	}
}]);