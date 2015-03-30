angular.module('ccApp', ['ccAppViews', 'ngRoute', 'ngAnimate'])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({
        redirectTo : '/'
    });
}])

.run(['$rootScope', 'ccNavData', function($rootScope, ccNavData){
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre){
        ccNavData.current = current.$$route.originalPath;
    });
}]);