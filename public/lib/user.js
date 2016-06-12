angular.module('user', ['base'])


.factory('User', function($resource) {
    return $resource(
        '/users/:id',
        null,
        {update:{method:'PUT'}}
    );
})

.service('authentication', ['$http', '$window', function($http, $window) {
    var saveToken = function(token) {
        $window.localStorage['mean-token'] = token;
    }
    var getToken = function () {
      return $window.localStorage['mean-token'];
    };
    
    logout = function() {
      $window.localStorage.removeItem('mean-token');
    };
    
    var isLoggedIn = function() {
        var token = getToken();
        var payload;

        if(token){
            console.log(token);
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            //console.log(payload.exp);
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function() {
        if(isLoggedIn()){
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
            email : payload.email,
            name : payload.name
            };
        }
    };
    
    
    login = function(user) {
        return $http.post('/users/login', user);
    };
    
    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout,
      isLoggedIn: isLoggedIn,
      login:login
    };
    
    
    
}])

.directive('pwmatch', function(){
    return {
        require:'ngModel',
        scope: {
            firstpassord: "=pwmatch"
        },
        link: function(scope, elem, attr, ngModel) {
            //var pwfield = '#'+attr.pwmatch;
            
            ngModel.$validators.pwmatch = function(modelValue) {
                return modelValue == scope.firstpassord;
            }
            
            scope.$watch('firstpassord', function() {
               ngModel.$validate(); 
            });
            
        }
    }
})

.controller('UserController', ['$scope', 'User', '$http', '$rootScope', 'authentication', '$location', function($scope, User, $http, $rootScope, authentication, $location){
    
    $scope.init();
    
    $scope.registrationSuccess = false;
    
    $scope.validusername = /^[a-zA-Z0-9]*$/;

    $scope.removeAlert();
    
    $rootScope.loggedIn = authentication.isLoggedIn();
    
    //$scope.myForm.$inValid = false;
    $rootScope.logout = function() {
        authentication.logout();
        $rootScope.loggedIn = authentication.isLoggedIn();
        $location.path('/user/login');
        $scope.showAlert({message:'Logout successfully!', type:'success'});
        
    }

    $scope.login = function() {
        authentication.login($scope.user).success(function(data) {
            authentication.saveToken(data.token);
            $rootScope.loggedIn = authentication.isLoggedIn();
            $location.path('/user/profile');
        }).error(function(err) {
            $scope.showAlert({message:err.message, type:'warning'});
            //console.log(err);  
        });
    }
    
    $scope.register = function() {
        
        if ($scope.myForm.$inValid) {
            return;
        }
        
        var params =  $scope.user;
        //delete params.password_confirm;
        var u = new User(params);
        
        $http({
            method:'post', 
            url:"/users/duplicatecheck", 
            data: params 
        })
        .then(function(res) {
            u.$save(function() {
                $scope.user = '';
            }).then(function saveSuccess(res){
                    $scope.registrationSuccess = true;
                    $scope.showAlert({message:'Successfully registered! Click <a href="#/user/login">here</a> to login ', type:'success'});
                },function saveFailure(res){
                    $scope.showAlert({message:res.data.message, type:'warning'});
                }
            );
            },
            function(res) {
                $scope.showAlert({message:res.data.message, type:'warning'});
                
            }
        );
         
        
    }
    
}])

.controller('UserProfileController', ['$scope', 'User', '$http', 'authentication', function($scope, User, $http, authentication) {
    var getProfile = function () {
        return $http.get('/users/profile', {
                headers: {
                    Authorization: 'Bearer '+ authentication.getToken()
                }
            }
        );
    };
    
    getProfile()
    .success(function(data) {
      $scope.user = data;
    })
    .error(function (e) {
      console.log(e);
    });
    
}])




