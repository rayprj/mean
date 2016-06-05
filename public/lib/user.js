angular.module('user', ['base'])

.factory('User', function($resource) {
    return $resource(
        '/users/:id',
        null,
        {update:{method:'PUT'}}
    );
})

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

.controller('UserController', ['$scope', 'User', '$http', '$rootScope', function($scope, User, $http, $rootScope){
    
    $scope.init();
    
    $scope.registrationSuccess = false;
    
    $scope.validusername = /^[a-zA-Z0-9]*$/;
    
    //$scope.myForm.$inValid = false;
    
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
    
}]);
