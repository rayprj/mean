angular.module('todo', ['ngRoute', 'ngResource']);
    
angular.module('app', ['todo'])

.factory('Blogs', ['$resource', function($resource){
    return $resource('/blogs/:id', null, {
        'update': { method:'PUT' },
        //'get': {cache:true}
    });
}])


.controller('BlogController', ['$scope', 'Blogs', function ($scope, Blogs) {
    $scope.blogs = Blogs.query();
    
}])

.controller('HeaderController', function($scope, $location) {
    $scope.isActive = function(page) {
        return $location.path()==page;
    } 
})

.controller('BlogAddEditController', ['$scope', '$routeParams', '$location', 'Blogs', function($scope, $routeParams, $location, Blogs) {
    $scope.html = {label:'Add Blog', button:'Create'};
    
    if ('id' in $routeParams) {
        if ((!$scope.blog || $scope.blog.length < 1)) {
            $scope.blog = Blogs.get({id:$routeParams.id});
        } 
        $scope.html = {label:'Edit Blog', button:'Update'};
    }
    
    $scope.save = function() {
        if (!$scope.blog || $scope.blog.length < 1) {
            return;
        }
        if ('_id' in $scope.blog) { //edit mode
            Blogs.update({id: $scope.blog._id}, $scope.blog);
            //console.log($scope.blogs);
            $location.path('/'+$scope.blog._id);
        } else { //add mode
            var blog = new Blogs({ title: $scope.blog.title, body: $scope.blog.body });
            
            //$scope.blogs = !$scope.blogs?$scope.blogs:[];
            blog.$save(function(){
                
                //$scope.blogs.push(blog);
                $scope.blog = ''; // clear textbox
            });
        }
        
    };
    
}])
    
.controller('BlogDetailController', ['$scope', '$routeParams', 'Blogs', function($scope, $routeParams, Blogs) {
    $scope.blog = Blogs.get({id:$routeParams.id});
    //console.log($scope.blog);
}])


.config(['$routeProvider', '$interpolateProvider', function($routeProvider, $interpolateProvider) {
    
    $interpolateProvider.startSymbol('{/{');
    $interpolateProvider.endSymbol('}/}');

    $routeProvider
    .when(
        '/', {templateUrl:'/templates/blog/list.html', controller:'BlogController'}
    )
    .when(
        '/add', {templateUrl:'/templates/blog/add.html', controller:'BlogAddEditController'}
    )
    .when(
        '/:id', {templateUrl:'/templates/blog/detail.html', controller:'BlogDetailController'}
        )
        .when(
        '/:id/edit', {templateUrl:'/templates/blog/add.html', controller:'BlogAddEditController'}
        );
    
}])