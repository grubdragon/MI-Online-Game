var app = angular.module('MI-Online-Game', ['ngResource', 'ngRoute','facebook']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html',
		controller: 'facebookCtrl'
	})
	.when('/leaderboard', {
		templateUrl: 'partials/leaderboard.html',
		controller: 'leaderboardCtrl'
	})
	.when('/register', {
		templateUrl: 'partials/register.html',
		controller: 'regCtrl'
	})
	.when('/game', {
		templateUrl: 'partials/game.html',
		controller: 'questionCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

/* Facebook */
app.config(function(FacebookProvider) {
	FacebookProvider.init('364525113975028');
})

app.controller('facebookCtrl',['$rootScope', '$resource','$location','Facebook', function ($rootScope, $resource, $location, Facebook) {
	// Define user empty data :/
	$rootScope.user = {};

      // Defining user logged status
      $rootScope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $rootScope.byebye = false;
      $rootScope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
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
       	console.log("IntentLogin called");
       	if(!userIsConnected) {
       		console.log("IntentLogin body");
       		$rootScope.login();
       	}
       	else{
          $rootScope.me();
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
       
       /**
        * me 
        */
        $rootScope.me = function() {
        	Facebook.api('/me', function(response) {
            /**
             * Using $rootScope.$apply since this happens outside angular framework.
             */
             $rootScope.$apply(function() {
              $rootScope.user = response;
            });

             var send_user = {
               "fbid" : $rootScope.user.id
             };

             var Check = $resource('/api/users/check');
             Check.save(send_user, function(res){
               console.log("res log kiya: "+JSON.stringify(res));
<<<<<<< HEAD
               if(res['error']){
                $location.path('/register')
          }			
          else{
            $location.path('/');
      }
			/*
			var Questions = $resource('/:levelreq', { level:'@levelreq'},{
				update:{ method:'
				POST'}
			});
			Questions.post(level, function(res){
				$rootScope.question = res;
			}, function(err){})
			*/
		}, function(err){
			$location.path('/');
		});             
=======
               if(res.error){
                console.log("error hua");
                $location.path('/register')
              }			
              else{
                console.log("mein yaha aaya tha");
                $location.path('/leaderboard');
              }
            }, function(err){
             $location.path('/');
           });             
>>>>>>> ab62d97c976fc06a43b306999bc7281735de2322
             console.log("me: "+JSON.stringify(response));
           });
        };

      /**
       * Logout
       */
       $rootScope.logout = function() {
       	Facebook.logout(function() {
       		$rootScope.$apply(function() {
       			$rootScope.user   = {};
       			$rootScope.logged = false;  
       		});
       	});
       }

      /**
       * Taking approach of Events :D
       */
       $rootScope.$on('Facebook:statusChange', function(ev, data) {
       	console.log('Status: ', data);
       	if (data.status == 'connected') {
       		$rootScope.$apply(function() {
       			$rootScope.salutation = true;
       			$rootScope.byebye     = false;    
       		});
       	} else {
       		$rootScope.$apply(function() {
       			$rootScope.salutation = false;
       			$rootScope.byebye     = true;

            // Dismiss byebye message after two seconds
            $timeout(function() {
            	$rootScope.byebye = false;
            }, 2000)
          });
       	}


       });




     }]);
//app.factory('board', function($resource){
//	var data
//})

// ***** -> uncomment and define the controller function here

<<<<<<< HEAD
app.controller('leaderboardCtrl', ['$rootScope', '$resource', '$location', 'Facebook', function($rootScope, $resource, $location, Facebook){
	
      Facebook.getLoginStatus(function(response) {
            if (response.status != 'connected' || !($rootScope.user) ) {
                  $location.path('/');
            }
            else{
                  
            }
      });

      $rootScope.Leaderboard = function(){
		var user = {
			"name" : $rootScope.user.username,
			"fbid" : $rootScope.user.id
		};
		var Check = $rootScope('/api/users/check');
		Check.save(user, function(res){
			var board = $resource('/api/users/leaderboard');
			board.post(user, function(res){
				$rootScope.ranklist = res;
			}, function(err){

			});
		},
		function(err){
			$location.path('/');
		});
	}
=======
app.controller('leaderboardCtrl', ['$rootScope', '$scope', '$resource', '$location', 'Facebook', function($rootScope, $scope, $resource, $location, Facebook){
	
  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected' || !($rootScope.user) ) {
      $location.path('/');
    }
    else{
     var send_user = {
       "fbid" : $rootScope.user.id
     };

     var Check = $resource('/api/users/check');
     Check.save(send_user, function(res){
       console.log("res log kiya: "+JSON.stringify(res));
       if(res.error){
        console.log("error hua");
        $location.path('/register');
      }     
      else{
        var send_user = {
         "fbid" : $rootScope.user.id
       };
       var board = $resource('/api/users/leaderboard');
       board.save(send_user, function(res){
         if(res.error){
          console.log("error hua");
          $location.path('/register');
        }     
        else{
          console.log(res);
          $scope.ranklist = res;
        }
      }, function(err){
       $location.path('/');
     });

     }
   }, function(err){
     $location.path('/');
   });
   }
 });
>>>>>>> ab62d97c976fc06a43b306999bc7281735de2322


}]);

app.controller('answerCtrl', ['$rootScope', '$resource', '$http', function($rootScope, $resource, $http){

}]);

app.controller('regCtrl', ['$rootScope','$scope', '$resource','$location','Facebook', function($rootScope, $scope, $resource, $location, Facebook){
<<<<<<< HEAD
      Facebook.getLoginStatus(function(response) {
            if (response.status != 'connected' || !($rootScope.user) ) {
                  $location.path('/');
            }
            else{

            }
      });
      $rootScope.register = function() {

            Facebook.getLoginStatus(function(response) {
                  if (response.status != 'connected' || !($rootScope.user) ) {
                        $location.path('/');
                  }
                  else{
                        console.log("register called");
                        var send_user = {
                              "firstName": $scope.firstName,
                              "lastName": $scope.lastName,
                              "username": $scope.username,
                              "phone_no": $scope.phone,
                              "fbid": $rootScope.user.id,
                              "email": $scope.email
                        };

                        var Register=$resource('/api/users/');
                        Register.save(send_user, function(res){
                              if(res.success){
                                    $location.path('/game');      
                              }
                              else{
                                    $location.path('/');      
                              }                              
                              
                        }, function(err){

                        });
                  }
            });
      };
}]);

app.controller('questionCtrl', ['$rootScope', '$resource', '$http','$location', function($rootScope, $resource, $http, $routeParam, $location){
     var user = {
          "firstName" : $rootScope.user.firstName,
          "lastName" : $rootScope.user.lastName,
          "fbid" : $rootScope.user.fbid
    };
    var level = $rootScope.user.level;

    $rootScope.Question = function(user){


          var Check = $rootScope('/check');
          Check.save(user, function(res){

               var Questions = $resource('/:levelreq', { level:'@levelreq'},{
                    update:{ method:'POST'}
              });
               Questions.post(level, function(res){
                    $rootScope.question = res;
              }, function(err){})
         }, function(err){
               $location.path('/');
         });
    }

    $rootScope.Answer = function(){
      var answer = {
            "firstName" : $rootScope.user.firstName,
            "lastName" : $rootScope.user.lastName,
            "fbid" : $rootScope.user.fbid,
            "level" : $rootScope.user.level,
            "ans" : $rootScope.user.ans
      };
      var Check = $rootScope('/check');
      Check.save(user, function(res){
            var Answer = $resource('submit/:level', { level:'@level'}, {update:{method:'POST'}});
            Answer.post(answer, function(res){
                  $rootScope.ans = res; 
            })
      },function(err){});
=======
  Facebook.getLoginStatus(function(response) {
    if (response.status != 'connected' || !($rootScope.user) ) {
      $location.path('/');
    }
    else{

    }
  });
  $rootScope.register = function() {

    Facebook.getLoginStatus(function(response) {
      if (response.status != 'connected' || !($rootScope.user) ) {
        $location.path('/');
      }
      else{
        console.log("register called");
        console.log($rootScope.user.id);
        var fbid=$rootScope.user.id;
        var send_user = {
          "firstName": $scope.firstName,
          "lastName": $scope.lastName,
          "username": $scope.username,
          "phone_no": $scope.phone,
          "fbid": fbid,
          "email": $scope.email
        };

        var Register=$resource('/api/users/');
        Register.save(send_user, function(res){
          if(res.success){
            $location.path('/game');      
          }
          else{
            $location.path('/');      
          }                              

        }, function(err){

        });
      }
    });
  };
}]);

app.controller('questionCtrl', ['$rootScope', '$resource', '$http','$location', function($rootScope, $resource, $http, $routeParam, $location){
 var user = {
  "firstName" : $rootScope.user.firstName,
  "lastName" : $rootScope.user.lastName,
  "fbid" : $rootScope.user.fbid
};
var level = $rootScope.user.level;

$rootScope.Question = function(user){

  var Check = $rootScope('/check');
  Check.save(user, function(res){

   var Questions = $resource('/:levelreq', { level:'@levelreq'},{
    update:{ method:'POST'}
  });
   Questions.post(level, function(res){
    $rootScope.question = res;
  }, function(err){})
 }, function(err){
   $location.path('/');
 });
}

$rootScope.Answer = function(){
  var answer = {
    "firstName" : $rootScope.user.firstName,
    "lastName" : $rootScope.user.lastName,
    "fbid" : $rootScope.user.fbid,
    "level" : $rootScope.user.level,
    "ans" : $rootScope.user.ans
  };
  var Check = $rootScope('/check');
  Check.save(user, function(res){
    var Answer = $resource('submit/:level', { level:'@level'}, {update:{method:'POST'}});
    Answer.post(answer, function(res){
      $rootScope.ans = res; 
    })
  },function(err){});
>>>>>>> ab62d97c976fc06a43b306999bc7281735de2322

}
}]);

