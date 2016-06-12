angular.module('app', ['base','blog', 'user'])

.config(['$routeProvider', '$interpolateProvider', '$stateProvider', function($routeProvider, $interpolateProvider, $stateProvider) {
    
    $interpolateProvider.startSymbol('{/{');
    $interpolateProvider.endSymbol('}/}');


    /*
    $stateProvider
    .state('home',
        {url:'/', templateUrl:'/templates/blog/list.html', controller:'BlogController'}
    )
    .state('blog.add',
        {url: '/add', templateUrl:'/templates/blog/add.html', controller:'BlogAddEditController'}
    )
    .state('blog.detail',
        {url:'/:id', templateUrl:'/templates/blog/detail.html', controller:'BlogDetailController'}
    )
    .state('blog.edit',
        {url:'/:id/edit', templateUrl:'/templates/blog/add.html', controller:'BlogAddEditController'}
    )
    .state('user.register',
        {url:'/user/register', templateUrl:'/templates/user/add.html', controller:'UserController'}
    )
    .state('user.login',
        {url:'/user/login', templateUrl:'/templates/user/login.html', controller:'UserController'   }
    )
    .state('user.profile',
        {url:'/user/profile', templateUrl:'/templates/user/profile.html', controller:'UserProfileController'}
    )
    
    */

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
    )
    .when(
    '/user/register', {templateUrl:'/templates/user/add.html', controller:'UserController'}
    )
    .when(
    '/user/login', {templateUrl:'/templates/user/login.html', controller:'UserController'}
    )
    .when(
    '/user/profile', {templateUrl:'/templates/user/profile.html', controller:'UserProfileController'}
    )
    .otherwise({redirectTo: '/'});

}])

.run(['$rootScope', '$location', 'authentication', function($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        //console.log($location.path())
        var loc = $location.path();
        if (!authentication.isLoggedIn()) {
            
            if (loc === '/user/profile' || loc==='/add') {
                console.log('changing path');
                $location.path('/');
            }
        } else {
            if (loc === '/user/login' || loc==='/user/register') {
                //console.log('changing path');
                $location.path('/user/profile');
            }
        }
      
    });
}])




