angular.module('base', ['ngRoute', 'ngResource'])

.directive('alertDirective', function() {
    return {
        restrict: 'E',
        templateUrl: '/templates/alert/alert.html',
        replace:true
    }
})

.controller('HeaderController', function($scope, $location) {
    $scope.isActive = function(page) {
        return $location.path()==page;
    } 
})

.controller('baseController', ['$scope', '$sce', function($scope, $sce) {
    
    $scope.alertData = {};
    $scope.alertData.message = '';
    
    $scope.getAlertMessage = function() {
        return  $sce.trustAsHtml($scope.alertData.message);
    }
    
    $scope.showAlert = function(args) {
        //console.log(args);
        $scope.alertData = {};
        $scope.alertData.message = args.message;
        $scope.alertData.type    = args.type;
    };
    
    $scope.removeAlert = function(args) {
        $scope.alertData = '';
    };
    
    $scope.init = function(args) {
        $scope.removeAlert();
    }
    
    
}])