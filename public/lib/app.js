angular.module('app', ['base','blog', 'user'])

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
    )
    .when(
    '/user/register', {templateUrl:'/templates/user/add.html', controller:'UserController'}
    )
    .when(
    '/user/login', {templateUrl:'/templates/user/login.html', controller:'UserController'}
    )
    
}])


